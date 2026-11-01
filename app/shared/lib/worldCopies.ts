import type { LatLngTuple } from "leaflet";

const WORLD_WIDTH_DEGREES = 360;

export const WORLD_COPIES = [-WORLD_WIDTH_DEGREES, 0, WORLD_WIDTH_DEGREES];

export function shiftPoint(point: LatLngTuple, offset: number): LatLngTuple {
  return offset === 0 ? point : [point[0], point[1] + offset];
}

export function shiftPath(path: LatLngTuple[], offset: number): LatLngTuple[] {
  return offset === 0 ? path : path.map((point) => shiftPoint(point, offset));
}

export function alignLongitude(point: LatLngTuple, referenceLongitude: number): LatLngTuple {
  return shiftPoint(point, WORLD_WIDTH_DEGREES * Math.round((referenceLongitude - point[1]) / WORLD_WIDTH_DEGREES));
}

export function alignPath(path: LatLngTuple[], referenceLongitude: number): LatLngTuple[] {
  const first = path.at(0);

  return first === undefined ? path : shiftPath(path, alignLongitude(first, referenceLongitude)[1] - first[1]);
}
