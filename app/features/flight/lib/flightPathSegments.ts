import type { LatLngTuple } from "leaflet";
import type { FlightPathElement } from "~/features/flight";
import { smoothFlightPath } from "~/features/flight/lib/smooth";
import { altitudeToColor, quantizeAltitude } from "~/shared/lib/altitudeColor";

export type ColoredSegment = {
  positions: LatLngTuple[];
  color: string;
  id: number;
};

export function buildColoredSegments(path: FlightPathElement[]): ColoredSegment[] {
  const smoothed = smoothFlightPath(path);
  if (smoothed.length < 2) return [];

  const segments: ColoredSegment[] = [];
  let currentBucket = quantizeAltitude(smoothed[0].altitude);
  let currentColor = altitudeToColor(currentBucket);
  let currentPositions: LatLngTuple[] = [smoothed[0].position];

  for (let i = 1; i < smoothed.length; i++) {
    const bucket = quantizeAltitude(smoothed[i].altitude);
    if (bucket === currentBucket) {
      currentPositions.push(smoothed[i].position);
      continue;
    }
    currentPositions.push(smoothed[i].position);
    segments.push({ positions: currentPositions, color: currentColor, id: segments.length });
    currentBucket = bucket;
    currentColor = altitudeToColor(bucket);
    currentPositions = [smoothed[i - 1].position, smoothed[i].position];
  }
  segments.push({ positions: currentPositions, color: currentColor, id: segments.length });
  return segments;
}
