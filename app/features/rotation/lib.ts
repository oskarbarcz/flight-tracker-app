import type { LatLngTuple } from "leaflet";
import type { Airport } from "~/features/airport";
import { airportRoute } from "~/features/flight/lib/flightMapBounds";
import { alignPath } from "~/shared/lib/worldCopies";

export function formatBlockTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return hours > 0 ? `${hours}h ${remaining}m` : `${remaining}m`;
}

export type Segment = { id: string; start: Airport; end: Airport };
export type LegPath = { id: string; positions: LatLngTuple[]; midpoint: LatLngTuple };

function pairKey(segment: Segment): string {
  return [segment.start.id, segment.end.id].sort().join("|");
}

export function buildLegPaths(segments: Segment[]): LegPath[] {
  const totals = new Map<string, number>();
  for (const segment of segments) {
    const key = pairKey(segment);
    totals.set(key, (totals.get(key) ?? 0) + 1);
  }

  const occurrences = new Map<string, number>();
  let referenceLongitude = segments.at(0)?.start.location.longitude ?? 0;

  return segments.map((segment) => {
    const key = pairKey(segment);
    const total = totals.get(key) ?? 1;
    const occurrence = occurrences.get(key) ?? 0;
    occurrences.set(key, occurrence + 1);

    const points = alignPath(airportRoute(segment.start, segment.end), referenceLongitude);
    const [startLat, startLon] = points[0];
    const [endLat, endLon] = points[points.length - 1];
    referenceLongitude = endLon;

    const spread = occurrence - (total - 1) / 2;
    if (total < 2 || spread === 0 || points.length < 2) {
      return { id: segment.id, positions: points, midpoint: points[Math.floor(points.length / 2)] };
    }

    const direction = segment.start.id <= segment.end.id ? 1 : -1;
    const dLat = (endLat - startLat) * direction;
    const dLon = (endLon - startLon) * direction;
    const length = Math.hypot(dLat, dLon) || 1;
    const perpLat = -dLon / length;
    const perpLon = dLat / length;
    const magnitude = spread * Math.max(0.8, 0.022 * length);

    const positions = points.map(([lat, lon], index) => {
      const offset = magnitude * Math.sin((Math.PI * index) / (points.length - 1));
      return [lat + perpLat * offset, lon + perpLon * offset] as LatLngTuple;
    });

    return { id: segment.id, positions, midpoint: positions[Math.floor(positions.length / 2)] };
  });
}
