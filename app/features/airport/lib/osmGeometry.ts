import type { Coordinates } from "~/shared/models/coordinates";

const EARTH_RADIUS_M = 6_371_000;
const OUTLINE_EXTENT = 100;
const OUTLINE_PADDING = 3;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function distanceInMetres(from: Coordinates, to: Coordinates): number {
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);
  const halfChord =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(deltaLon / 2) ** 2;

  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(halfChord)));
}

export type OutlineViewport = {
  width: number;
  height: number;
  outlines: string[];
};

export function projectOutlines(polygons: (Coordinates[] | null)[]): OutlineViewport {
  const filled = polygons.filter((polygon): polygon is Coordinates[] => polygon !== null && polygon.length > 0);
  const empty = { width: OUTLINE_EXTENT, height: OUTLINE_EXTENT, outlines: polygons.map(() => "") };
  if (filled.length === 0) {
    return empty;
  }

  const points = filled.flat();
  const latitudeScale = Math.cos(toRadians(points.reduce((sum, point) => sum + point.latitude, 0) / points.length));
  const projected = points.map((point) => ({ x: point.longitude * latitudeScale, y: -point.latitude }));

  const minX = Math.min(...projected.map((point) => point.x));
  const minY = Math.min(...projected.map((point) => point.y));
  const spanX = Math.max(...projected.map((point) => point.x)) - minX;
  const spanY = Math.max(...projected.map((point) => point.y)) - minY;
  const longestSpan = Math.max(spanX, spanY);
  if (longestSpan === 0) {
    return empty;
  }

  const scale = OUTLINE_EXTENT / longestSpan;
  const place = (point: Coordinates) => {
    const x = (point.longitude * latitudeScale - minX) * scale + OUTLINE_PADDING;
    const y = (-point.latitude - minY) * scale + OUTLINE_PADDING;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  };

  return {
    width: spanX * scale + OUTLINE_PADDING * 2,
    height: spanY * scale + OUTLINE_PADDING * 2,
    outlines: polygons.map((polygon) => (polygon === null || polygon.length === 0 ? "" : polygon.map(place).join(" "))),
  };
}
