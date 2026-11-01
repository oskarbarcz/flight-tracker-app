import type { LatLngTuple } from "leaflet";
import { alignLongitude } from "~/shared/lib/worldCopies";

export type Vector = [number, number, number];

export const ROUTE_LINE_SMOOTH_FACTOR = 0.5;

const MAX_STEP_DEGREES = 0.5;
const COINCIDENT_RADIANS = 1e-9;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function toVector([latitude, longitude]: LatLngTuple): Vector {
  const lat = toRadians(latitude);
  const lon = toRadians(longitude);

  return [Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat)];
}

export function fromVector([x, y, z]: Vector): LatLngTuple {
  return [toDegrees(Math.atan2(z, Math.sqrt(x * x + y * y))), toDegrees(Math.atan2(y, x))];
}

function angleBetween([ax, ay, az]: Vector, [bx, by, bz]: Vector): number {
  const crossX = ay * bz - az * by;
  const crossY = az * bx - ax * bz;
  const crossZ = ax * by - ay * bx;

  return Math.atan2(Math.sqrt(crossX * crossX + crossY * crossY + crossZ * crossZ), ax * bx + ay * by + az * bz);
}

function interpolate(start: Vector, end: Vector, angle: number, fraction: number): Vector {
  const startWeight = Math.sin((1 - fraction) * angle) / Math.sin(angle);
  const endWeight = Math.sin(fraction * angle) / Math.sin(angle);

  return [
    start[0] * startWeight + end[0] * endWeight,
    start[1] * startWeight + end[1] * endWeight,
    start[2] * startWeight + end[2] * endWeight,
  ];
}

export function greatCirclePath(waypoints: LatLngTuple[]): LatLngTuple[] {
  const path: LatLngTuple[] = [];

  for (const waypoint of waypoints) {
    if (!Number.isFinite(waypoint[0]) || !Number.isFinite(waypoint[1])) {
      continue;
    }

    const previous = path.at(-1);
    if (previous === undefined) {
      path.push(waypoint);
      continue;
    }

    const start = toVector(previous);
    const end = toVector(waypoint);
    const angle = angleBetween(start, end);
    if (angle < COINCIDENT_RADIANS) {
      continue;
    }

    const steps = Math.sin(angle) < COINCIDENT_RADIANS ? 1 : Math.ceil(toDegrees(angle) / MAX_STEP_DEGREES);
    let reference = previous[1];

    for (let step = 1; step <= steps; step++) {
      const point = step === steps ? waypoint : fromVector(interpolate(start, end, angle, step / steps));
      const aligned = alignLongitude(point, reference);
      path.push(aligned);
      reference = aligned[1];
    }
  }

  return path;
}
