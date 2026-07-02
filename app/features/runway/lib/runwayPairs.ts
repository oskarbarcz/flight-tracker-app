import type { Runway } from "~/models";
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
