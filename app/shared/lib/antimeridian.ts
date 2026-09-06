import type { LatLngTuple } from "leaflet";

const HALF_TURN = 180;
const FULL_TURN = 360;

export function unwrapAcrossAntimeridian(path: LatLngTuple[]): LatLngTuple[] {
  let turns = 0;

  return path.map((point, index) => {
    if (index === 0) {
      return point;
    }

    const [, previousLongitude] = path[index - 1];
    const [latitude, longitude] = point;
    const step = longitude - previousLongitude;

    if (step > HALF_TURN) {
      turns -= 1;
    } else if (step < -HALF_TURN) {
      turns += 1;
    }

    return [latitude, longitude + turns * FULL_TURN] as LatLngTuple;
  });
}
