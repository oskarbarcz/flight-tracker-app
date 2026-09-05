import type { PlannedRoute, PlannedRouteFix } from "~/features/route/model";
import { padZero } from "~/shared/lib/time";

const DIRECT = "DCT";
const SPEED_LEVEL = /^(?<speed>[NK]\d{4}|M\d{3})?(?<level>F\d{3}|A\d{3}|S\d{4}|M\d{4}|VFR)?$/;
const AIRWAY_SHAPE = /^[A-Z]{1,3}\d{1,3}[A-Z]?$/;
const PROCEDURE_SHAPE = /^[A-Z]{3,5}\d[A-Z]?$/;
const OCEANIC_POSITION = /^(?:\d{2}(?:\d{2})?[NS]\d{3}(?:\d{2})?[EW]|\d{4}[NSEW])$/;
const NORTH_ATLANTIC_TRACK = /^NAT([A-Z])$/;
const SHORTEST_TRACK_GEOMETRY = 2;
const RANDOM_OCEANIC = "random";

export type RouteEndpoint = {
  icao: string;
  runway: string | null;
};

export type RouteFigure = {
  value: string;
  unit: string | null;
};

export enum RouteLevelStep {
  Climb = "climb",
  Descent = "descent",
}

export type RouteClearance = {
  speed: RouteFigure | null;
  level: RouteFigure | null;
  step: RouteLevelStep | null;
};

export enum RouteProcedure {
  Sid = "sid",
  Star = "star",
}

export enum RouteTokenKind {
  Airport = "airport",
  Procedure = "procedure",
  Waypoint = "waypoint",
  Airway = "airway",
  Clearance = "clearance",
  OceanicTrack = "oceanic_track",
}

type RouteTokenBody =
  | {
      kind: RouteTokenKind.Airport;
      text: string;
      runway: string | null;
      ordinal: number | null;
      isDestination: boolean;
    }
  | { kind: RouteTokenKind.Procedure; text: string; procedure: RouteProcedure }
  | { kind: RouteTokenKind.Waypoint; text: string; ordinal: number | null; clearance: RouteClearance | null }
  | { kind: RouteTokenKind.Airway; text: string }
  | { kind: RouteTokenKind.Clearance; clearance: RouteClearance }
  | { kind: RouteTokenKind.OceanicTrack; designator: string | null; segment: RouteToken[] };

export type RouteToken = RouteTokenBody & { id: string };

function parseSpeed(raw: string): RouteFigure {
  const digits = Number(raw.slice(1));

  if (raw.startsWith("M")) {
    const mach = (digits / 100).toFixed(2);

    return { value: `M${mach.startsWith("0") ? mach.slice(1) : mach}`, unit: null };
  }

  return { value: digits.toLocaleString("en-GB"), unit: raw.startsWith("K") ? "km/h" : "kt" };
}

function parseLevel(raw: string): { figure: RouteFigure; feet: number | null } {
  if (raw === "VFR") {
    return { figure: { value: "VFR", unit: null }, feet: null };
  }

  const digits = Number(raw.slice(1));

  if (raw.startsWith("F")) {
    return { figure: { value: `FL${padZero(digits, 3)}`, unit: null }, feet: digits * 100 };
  }

  if (raw.startsWith("A")) {
    return { figure: { value: (digits * 100).toLocaleString("en-GB"), unit: "ft" }, feet: digits * 100 };
  }

  const metres = raw.startsWith("S") ? digits * 10 : digits;

  return { figure: { value: metres.toLocaleString("en-GB"), unit: "m" }, feet: null };
}

function levelStep(from: number | null, to: number | null): RouteLevelStep | null {
  if (from === null || to === null || from === to) {
    return null;
  }

  return to > from ? RouteLevelStep.Climb : RouteLevelStep.Descent;
}

function figureText(figure: RouteFigure): string {
  return figure.unit === null ? figure.value : `${figure.value} ${figure.unit}`;
}

export function describeClearance(clearance: RouteClearance): string {
  const opening: Record<RouteLevelStep | "filed", string> = {
    filed: "Filed",
    [RouteLevelStep.Climb]: "Step climb",
    [RouteLevelStep.Descent]: "Step descent",
  };

  const figures = [clearance.speed, clearance.level]
    .filter((figure): figure is RouteFigure => figure !== null)
    .map(figureText)
    .join(" at ");

  return `${opening[clearance.step ?? "filed"]} ${figures}`;
}

export function describeOceanicTrack(designator: string | null): string {
  return designator === null ? "Oceanic crossing" : `${designator} track`;
}

function trackName(airway: string | null): string | null {
  const letter = airway === null ? null : (NORTH_ATLANTIC_TRACK.exec(airway)?.[1] ?? null);

  return letter === null ? null : `NAT ${letter}`;
}

function crossedOrdinals(fixes: PlannedRouteFix[]): Map<number, string> {
  const crossed = new Map<number, string>();

  fixes.forEach((fix, position) => {
    const name = trackName(fix.viaAirway);
    const entry = fixes[position - 1];

    if (name === null) {
      return;
    }

    if (entry !== undefined) {
      crossed.set(entry.ordinal, name);
    }

    crossed.set(fix.ordinal, name);
  });

  return crossed;
}

function segmentKey(token: RouteTokenBody, crossed: Map<number, string>): string | null {
  if (token.kind !== RouteTokenKind.Waypoint) {
    return null;
  }

  const flown = token.ordinal === null ? undefined : crossed.get(token.ordinal);

  if (flown !== undefined) {
    return flown;
  }

  return crossed.size === 0 && OCEANIC_POSITION.test(token.text) ? RANDOM_OCEANIC : null;
}

function restatesTrack(token: RouteTokenBody, designator: string | null): boolean {
  return token.kind === RouteTokenKind.OceanicTrack && token.designator === designator;
}

function crossedFixCount(segment: RouteTokenBody[]): number {
  return segment.filter((token) => token.kind === RouteTokenKind.Waypoint).length;
}

function oceanicTrack(key: string, segment: RouteTokenBody[]): RouteTokenBody {
  const designator = key === RANDOM_OCEANIC ? null : key;

  return {
    kind: RouteTokenKind.OceanicTrack,
    designator,
    segment: segment
      .filter((token) => !restatesTrack(token, designator))
      .map((token, position) => ({ ...token, id: `${position}-${token.kind}` })),
  };
}

function groupOceanicSegments(tokens: RouteTokenBody[], fixes: PlannedRouteFix[]): RouteTokenBody[] {
  const crossed = crossedOrdinals(fixes);
  const grouped: RouteTokenBody[] = [];

  let key: string | null = null;
  let segment: RouteTokenBody[] = [];
  let between: RouteTokenBody[] = [];

  const closeSegment = () => {
    if (key !== null && crossedFixCount(segment) >= SHORTEST_TRACK_GEOMETRY) {
      grouped.push(oceanicTrack(key, segment));
    } else {
      grouped.push(...segment);
    }

    grouped.push(...between);
    key = null;
    segment = [];
    between = [];
  };

  for (const token of tokens) {
    const found = segmentKey(token, crossed);

    if (found === null) {
      (key === null ? grouped : between).push(token);
      continue;
    }

    if (found !== key) {
      closeSegment();
      key = found;
    }

    segment.push(...between, token);
    between = [];
  }

  closeSegment();

  return grouped;
}

function terminalProcedures(fixes: PlannedRouteFix[]): Map<string, RouteProcedure> {
  const named = new Map<string, RouteProcedure>();
  const afterDeparture = fixes.at(1)?.viaAirway ?? null;
  const beforeArrival = fixes.at(-1)?.viaAirway ?? null;

  if (afterDeparture !== null && afterDeparture !== DIRECT) {
    named.set(afterDeparture, RouteProcedure.Sid);
  }

  if (beforeArrival !== null && beforeArrival !== DIRECT) {
    named.set(beforeArrival, RouteProcedure.Star);
  }

  return named;
}

function filedAirways(fixes: PlannedRouteFix[]): Set<string> {
  return new Set(fixes.map((fix) => fix.viaAirway).filter((airway): airway is string => airway !== null));
}

export function parseFiledRoute(
  route: PlannedRoute,
  departure: RouteEndpoint,
  destination: RouteEndpoint,
): RouteToken[] {
  const words = (route.atcRoute ?? "")
    .trim()
    .split(/\s+/)
    .filter((word) => word !== "");

  if (words.length === 0) {
    return [];
  }

  const named = terminalProcedures(route.fixes);
  const enroute = filedAirways(route.fixes);
  const tokens: RouteTokenBody[] = [];

  let cursor = 0;
  let clearedFeet: number | null = null;

  const takeOrdinal = (ident: string): number | null => {
    const ahead = route.fixes.findIndex((fix, position) => position >= cursor && fix.ident === ident);

    if (ahead === -1) {
      return route.fixes.find((fix) => fix.ident === ident)?.ordinal ?? null;
    }

    cursor = ahead + 1;

    return route.fixes[ahead].ordinal;
  };

  const takeClearance = (raw: string): RouteClearance | null => {
    const groups = SPEED_LEVEL.exec(raw)?.groups;

    if (groups === undefined || (groups.speed === undefined && groups.level === undefined)) {
      return null;
    }

    const level = groups.level === undefined ? null : parseLevel(groups.level);
    const step = levelStep(clearedFeet, level?.feet ?? null);

    if (level !== null && level.feet !== null) {
      clearedFeet = level.feet;
    }

    return {
      speed: groups.speed === undefined ? null : parseSpeed(groups.speed),
      level: level?.figure ?? null,
      step,
    };
  };

  const airport = (endpoint: RouteEndpoint, isDestination: boolean): RouteTokenBody => ({
    kind: RouteTokenKind.Airport,
    text: endpoint.icao,
    runway: endpoint.runway,
    ordinal: takeOrdinal(endpoint.icao),
    isDestination,
  });

  const classify = (word: string): RouteTokenBody => {
    const [ident, change = null] = word.split("/");
    const clearance = change === null ? null : takeClearance(change);
    const procedure = named.get(ident);

    if (procedure !== undefined) {
      return { kind: RouteTokenKind.Procedure, text: ident, procedure };
    }

    const filedTrack = trackName(ident);

    if (filedTrack !== null) {
      return { kind: RouteTokenKind.OceanicTrack, designator: filedTrack, segment: [] };
    }

    const ordinal = takeOrdinal(ident);

    if (ordinal !== null) {
      return { kind: RouteTokenKind.Waypoint, text: ident, ordinal, clearance };
    }

    if (enroute.has(ident)) {
      return { kind: RouteTokenKind.Airway, text: ident };
    }

    const group = change === null ? takeClearance(ident) : null;

    if (group !== null) {
      return { kind: RouteTokenKind.Clearance, clearance: group };
    }

    if (ident === DIRECT || AIRWAY_SHAPE.test(ident)) {
      return { kind: RouteTokenKind.Airway, text: ident };
    }

    if (PROCEDURE_SHAPE.test(ident)) {
      const enrouteStarted = tokens.some((token) => token.kind === RouteTokenKind.Waypoint);

      return {
        kind: RouteTokenKind.Procedure,
        text: ident,
        procedure: enrouteStarted ? RouteProcedure.Star : RouteProcedure.Sid,
      };
    }

    return { kind: RouteTokenKind.Waypoint, text: ident, ordinal: null, clearance };
  };

  if (words[0] !== departure.icao) {
    tokens.push(airport(departure, false));
  }

  for (const word of words) {
    const endpoint = [departure, destination].find(({ icao }) => icao === word) ?? null;

    tokens.push(endpoint === null ? classify(word) : airport(endpoint, endpoint === destination));
  }

  if (words.at(-1) !== destination.icao) {
    tokens.push(airport(destination, true));
  }

  return groupOceanicSegments(tokens, route.fixes).map((token, position) => ({
    ...token,
    id: `${position}-${token.kind}`,
  }));
}
