import { fn } from "storybook/test";
import { type Airport, Continent, DataQuality } from "~/features/airport/model";
import type { RouteBriefingState } from "~/features/route/hooks/useRouteBriefing";
import { buildFixInsights } from "~/features/route/lib/routeInsights";
import {
  type EtopsBriefing,
  type EtopsPoint,
  EtopsPointKind,
  OceanicDirection,
  OceanicRouting,
  type PlannedRouteFix,
} from "~/features/route/model";

type Waypoint = { ident: string; latitude: number; longitude: number };

const POLAR_WAYPOINTS: Waypoint[] = [
  { ident: "KJFK", latitude: 40.64, longitude: -73.78 },
  { ident: "YVP", latitude: 58.1, longitude: -68.4 },
  { ident: "YRB", latitude: 74.72, longitude: -94.97 },
  { ident: "N8012W", latitude: 80, longitude: -120 },
  { ident: "N8317W", latitude: 83, longitude: -170 },
  { ident: "N8016E", latitude: 80, longitude: 160 },
  { ident: "YKS", latitude: 62.09, longitude: 129.77 },
  { ident: "HLD", latitude: 49.2, longitude: 119.82 },
  { ident: "VHHH", latitude: 22.31, longitude: 113.91 },
];

const POLAR_NAVLOG: Waypoint[] = [
  POLAR_WAYPOINTS[0],
  { ident: "TOC", latitude: 43.4, longitude: -73.1 },
  ...POLAR_WAYPOINTS.slice(1, -1),
  { ident: "TOD", latitude: 25.6, longitude: 114.6 },
  POLAR_WAYPOINTS[POLAR_WAYPOINTS.length - 1],
];

function plannedFix({ ident, latitude, longitude }: Waypoint, index: number): PlannedRouteFix {
  return {
    ordinal: index + 1,
    ident,
    latitude,
    longitude,
    altitude: 36_000,
    elapsedSeconds: index * 3_600,
    distanceNm: index === 0 ? null : 500,
    trackTrue: null,
    trackMag: null,
    viaAirway: null,
    stage: "CRZ",
    fuel: { flow: null, leg: null, used: null, minimumOnBoard: null, plannedOnBoard: null },
    fuelReport: null,
    oat: null,
    isaDeviation: null,
    tropopause: null,
    mora: null,
    fir: null,
    wind: { direction: null, speed: null, levels: [] },
  };
}

export const polarBriefing: EtopsBriefing = {
  etops: null,
  route: {
    route: POLAR_WAYPOINTS.map((waypoint) => waypoint.ident).join(" "),
    atcRoute: null,
    fixes: POLAR_NAVLOG.map(plannedFix),
  },
  oceanicCrossing: {
    routing: OceanicRouting.Track,
    trackId: "P",
    direction: OceanicDirection.West,
    tracks: [
      {
        identifier: "P",
        direction: OceanicDirection.West,
        tmi: "001",
        issuingOca: null,
        route: null,
        levels: [],
        validFrom: null,
        validTo: null,
        fixes: POLAR_WAYPOINTS.slice(2, 7).map(({ ident, latitude, longitude }) => ({
          ident,
          latitude: latitude - 3,
          longitude,
        })),
      },
    ],
  },
};

const TRANSPOLAR_WAYPOINTS: Waypoint[] = [
  { ident: "KJFK", latitude: 40.64, longitude: -73.78 },
  { ident: "YVP", latitude: 58.1, longitude: -68.4 },
  { ident: "N7508W", latitude: 75, longitude: -80 },
  { ident: "N8509W", latitude: 85, longitude: -90 },
  { ident: "N8809W", latitude: 88, longitude: -90 },
  { ident: "N8911E", latitude: 89, longitude: 110 },
  { ident: "N8611E", latitude: 86, longitude: 110 },
  { ident: "N7512E", latitude: 75, longitude: 120 },
  { ident: "HLD", latitude: 49.2, longitude: 119.82 },
  { ident: "VHHH", latitude: 22.31, longitude: 113.91 },
];

export const transpolarBriefing: EtopsBriefing = {
  etops: null,
  route: {
    route: TRANSPOLAR_WAYPOINTS.map((waypoint) => waypoint.ident).join(" "),
    atcRoute: null,
    fixes: TRANSPOLAR_WAYPOINTS.map(plannedFix),
  },
  oceanicCrossing: { routing: OceanicRouting.Random, trackId: null, direction: null, tracks: [] },
};

function etopsAirport(
  id: string,
  icaoCode: string,
  iataCode: string,
  name: string,
  continent: Continent,
  latitude: number,
  longitude: number,
): Airport {
  return {
    id,
    icaoCode,
    iataCode,
    city: { id: `${id}-city`, name },
    name,
    country: { code: "XX", name: "Fixture" },
    timezone: "UTC",
    continent,
    dataQuality: DataQuality.Low,
    location: { latitude, longitude },
    shape: null,
  };
}

const POLAR_ETOPS_AIRPORTS: Airport[] = [
  etopsAirport("etops-cyrb", "CYRB", "YRB", "Resolute Bay", Continent.NorthAmerica, 74.7169, -94.9694),
  etopsAirport("etops-pabr", "PABR", "BRW", "Utqiagvik", Continent.NorthAmerica, 71.2854, -156.766),
  etopsAirport("etops-uhma", "UHMA", "DYR", "Anadyr Ugolny", Continent.Asia, 64.7349, 177.7413),
  etopsAirport("etops-ueee", "UEEE", "YKS", "Yakutsk", Continent.Asia, 62.0933, 129.7706),
];

export const polarEtopsAirports = new Map(POLAR_ETOPS_AIRPORTS.map((airport) => [airport.id, airport]));

function etopsPoint(
  kind: EtopsPointKind,
  ordinal: number,
  latitude: number,
  longitude: number,
  isCritical = false,
): EtopsPoint {
  return {
    kind,
    ordinal,
    isCritical,
    adequateAirportId: null,
    position: { latitude, longitude },
    elapsedSeconds: 0,
    condition: null,
    diversionAirports: [],
  };
}

export const polarEtopsBriefing: EtopsBriefing = {
  ...polarBriefing,
  etops: {
    ruleMinutes: 180,
    ruleRadiusNm: 1_250,
    thresholdMinutes: 60,
    thresholdRadiusNm: 410,
    airports: POLAR_ETOPS_AIRPORTS.map((airport) => ({
      airportId: airport.id,
      suitabilityStart: "2025-01-01T12:00:00Z",
      suitabilityEnd: "2025-01-02T00:00:00Z",
      plannedRunway: null,
      forecastCeiling: null,
      forecastVisibility: null,
      transitionAltitude: null,
      transitionLevel: null,
    })),
    points: [
      etopsPoint(EtopsPointKind.Entry, 1, 66.2, -73.5),
      etopsPoint(EtopsPointKind.EqualTime, 1, 78.6, -113.2),
      etopsPoint(EtopsPointKind.EqualTime, 2, 82.6, -164.8),
      etopsPoint(EtopsPointKind.Critical, 1, 81.4, 172.5, true),
      etopsPoint(EtopsPointKind.Exit, 1, 58.2, 126.9),
    ],
  },
};

export function routeBriefingState(briefing: EtopsBriefing, airports = new Map<string, Airport>()): RouteBriefingState {
  return {
    briefing,
    airports,
    loading: false,
    error: null,
    runways: { departure: null, arrival: null },
    insights: buildFixInsights(briefing.route.fixes),
    summary: null,
    margin: null,
    canReportFuel: false,
    reportFixFuel: async () => {},
    selectedOrdinal: null,
    select: fn(),
  };
}
