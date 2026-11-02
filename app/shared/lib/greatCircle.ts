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

const CIRCLE_STEPS = 128;

export function destinationPoint(
  [latitude, longitude]: LatLngTuple,
  bearing: number,
  angularDistance: number,
): LatLngTuple {
  const lat = toRadians(latitude);
  const heading = toRadians(bearing);
  const pointLat = Math.asin(
    Math.sin(lat) * Math.cos(angularDistance) + Math.cos(lat) * Math.sin(angularDistance) * Math.cos(heading),
  );
  const pointLon =
    toRadians(longitude) +
    Math.atan2(
      Math.sin(heading) * Math.sin(angularDistance) * Math.cos(lat),
      Math.cos(angularDistance) - Math.sin(lat) * Math.sin(pointLat),
    );

  return [toDegrees(pointLat), toDegrees(pointLon)];
}

export function geodesicCircle(centre: LatLngTuple, angularRadius: number): LatLngTuple[] {
  const ring: LatLngTuple[] = [];

  for (let step = 0; step <= CIRCLE_STEPS; step++) {
    const point = destinationPoint(centre, (360 * step) / CIRCLE_STEPS, angularRadius);

    ring.push(alignLongitude(point, ring.at(-1)?.[1] ?? centre[1]));
  }

  return ring;
}

export type SphericalSpread = {
  centre: LatLngTuple;
  angularRadius: number;
};

export function sphericalSpread(points: LatLngTuple[]): SphericalSpread | null {
  if (points.length === 0) {
    return null;
  }

  const vectors = points.map(toVector);
  const sum = vectors.reduce<Vector>((total, [x, y, z]) => [total[0] + x, total[1] + y, total[2] + z], [0, 0, 0]);
  const length = Math.hypot(...sum);
  const centre: Vector = length < COINCIDENT_RADIANS ? vectors[0] : [sum[0] / length, sum[1] / length, sum[2] / length];

  return {
    centre: fromVector(centre),
    angularRadius: Math.max(...vectors.map((vector) => angleBetween(centre, vector))),
  };
}
