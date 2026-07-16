import type { Runway } from "~/features/runway";
import { padZero } from "~/shared/lib/time";

export type RunwayPair = {
  key: string;
  ends: Runway[];
};

export type RunwayLine = {
  key: string;
  positions: [number, number][];
  ends: Runway[];
};

export function reciprocalDesignator(designator: string): string {
  const numMatch = designator.match(/^(\d+)/);
  if (!numMatch) return designator;
  const num = Number.parseInt(numMatch[1], 10);
  const suffix = designator.match(/[LCR]$/)?.[0] ?? "";
  const recipNum = num <= 18 ? num + 18 : num - 18;
  const recipSuffix = suffix === "L" ? "R" : suffix === "R" ? "L" : suffix;
  return `${padZero(recipNum)}${recipSuffix}`;
}

function pairKey(designator: string): string {
  const reciprocal = reciprocalDesignator(designator);
  const dNum = Number.parseInt(designator, 10);
  const rNum = Number.parseInt(reciprocal, 10);
  return dNum <= rNum ? `${designator}|${reciprocal}` : `${reciprocal}|${designator}`;
}

function designatorOrder(d: string): number {
  return Number.parseInt(d, 10);
}

export function groupRunwaysByPair(runways: Runway[]): RunwayPair[] {
  const groups = new Map<string, Runway[]>();
  for (const runway of runways) {
    const key = pairKey(runway.designator);
    const existing = groups.get(key) ?? [];
    existing.push(runway);
    groups.set(key, existing);
  }
  return Array.from(groups.entries())
    .map(([key, ends]) => ({
      key,
      ends: ends.sort((a, b) => designatorOrder(a.designator) - designatorOrder(b.designator)),
    }))
    .sort((a, b) => designatorOrder(a.ends[0].designator) - designatorOrder(b.ends[0].designator));
}

function destinationPoint(lat: number, lng: number, bearingDeg: number, distanceM: number): [number, number] {
  const earthRadiusM = 6371000;
  const lat1Rad = (lat * Math.PI) / 180;
  const lon1Rad = (lng * Math.PI) / 180;
  const bearingRad = (bearingDeg * Math.PI) / 180;
  const angularDistance = distanceM / earthRadiusM;

  const lat2Rad = Math.asin(
    Math.sin(lat1Rad) * Math.cos(angularDistance) +
      Math.cos(lat1Rad) * Math.sin(angularDistance) * Math.cos(bearingRad),
  );
  const lon2Rad =
    lon1Rad +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(angularDistance) * Math.cos(lat1Rad),
      Math.cos(angularDistance) - Math.sin(lat1Rad) * Math.sin(lat2Rad),
    );

  return [(lat2Rad * 180) / Math.PI, (lon2Rad * 180) / Math.PI];
}

export type RunwayRibbon = {
  key: string;
  polygon: [number, number][];
  centerline: [[number, number], [number, number]];
  ends: Runway[];
};

function initialBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;
  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export function computeRunwayRibbons(runways: Runway[]): RunwayRibbon[] {
  const pairs = groupRunwaysByPair(runways);
  return pairs.map((pair) => {
    let start: [number, number];
    let end: [number, number];
    let width: number;

    if (pair.ends.length === 2) {
      start = [pair.ends[0].coordinates.latitude, pair.ends[0].coordinates.longitude];
      end = [pair.ends[1].coordinates.latitude, pair.ends[1].coordinates.longitude];
      width = pair.ends[0].width;
    } else {
      const only = pair.ends[0];
      start = [only.coordinates.latitude, only.coordinates.longitude];
      end = destinationPoint(start[0], start[1], only.magneticHeading, only.length);
      width = only.width;
    }

    const bearing = initialBearing(start[0], start[1], end[0], end[1]);
    const half = width / 2;
    const polygon: [number, number][] = [
      destinationPoint(start[0], start[1], bearing + 90, half),
      destinationPoint(end[0], end[1], bearing + 90, half),
      destinationPoint(end[0], end[1], bearing - 90, half),
      destinationPoint(start[0], start[1], bearing - 90, half),
    ];

    return { key: pair.key, polygon, centerline: [start, end], ends: pair.ends };
  });
}

export function computeRunwayLines(runways: Runway[]): RunwayLine[] {
  const pairs = groupRunwaysByPair(runways);
  return pairs.flatMap((pair) => {
    if (pair.ends.length === 2) {
      const positions: [number, number][] = pair.ends.map((end) => [
        end.coordinates.latitude,
        end.coordinates.longitude,
      ]);
      return [{ key: pair.key, positions, ends: pair.ends }];
    }
    const end = pair.ends[0];
    const otherEnd = destinationPoint(
      end.coordinates.latitude,
      end.coordinates.longitude,
      end.magneticHeading,
      end.length,
    );
    const positions: [number, number][] = [[end.coordinates.latitude, end.coordinates.longitude], otherEnd];
    return [{ key: pair.key, positions, ends: pair.ends }];
  });
}
