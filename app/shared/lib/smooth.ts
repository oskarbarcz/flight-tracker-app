import type { LatLngTuple } from "leaflet";
import type { FlightPathElement } from "~/models";
import type { Position } from "~/models/common/geo";

export type SmoothedFlightPoint = {
  position: LatLngTuple;
  altitude: number | undefined;
};

export function smoothFlightPath(elements: FlightPathElement[], granularity: number = 16): SmoothedFlightPoint[] {
  if (elements.length < 2) {
    return elements.map((e) => ({ position: [e.latitude, e.longitude], altitude: e.altitude }));
  }

  const result: SmoothedFlightPoint[] = [
    { position: [elements[0].latitude, elements[0].longitude], altitude: elements[0].altitude },
  ];

  for (let i = 0; i < elements.length - 1; i++) {
    const p0 = elements[i === 0 ? i : i - 1];
    const p1 = elements[i];
    const p2 = elements[i + 1];
    const p3 = elements[i === elements.length - 2 ? i + 1 : i + 2];

    for (let t = 1; t <= granularity; t++) {
      const tStep = t / granularity;
      const t2 = tStep * tStep;
      const t3 = t2 * tStep;

      const newLat =
        0.5 *
        (2 * p1.latitude +
          (-p0.latitude + p2.latitude) * tStep +
          (2 * p0.latitude - 5 * p1.latitude + 4 * p2.latitude - p3.latitude) * t2 +
          (-p0.latitude + 3 * p1.latitude - 3 * p2.latitude + p3.latitude) * t3);

      const newLng =
        0.5 *
        (2 * p1.longitude +
          (-p0.longitude + p2.longitude) * tStep +
          (2 * p0.longitude - 5 * p1.longitude + 4 * p2.longitude - p3.longitude) * t2 +
          (-p0.longitude + 3 * p1.longitude - 3 * p2.longitude + p3.longitude) * t3);

      let altitude: number | undefined;
      if (p1.altitude !== undefined && p2.altitude !== undefined) {
        altitude = p1.altitude + (p2.altitude - p1.altitude) * tStep;
      } else {
        altitude = p1.altitude ?? p2.altitude;
      }

      result.push({ position: [newLat, newLng], altitude });
    }
  }

  return result;
}

export function smoothPath(points: Position[], granularity: number = 16): LatLngTuple[] {
  if (points.length < 2) {
    return points.map((p) => (Array.isArray(p) ? p : [p.lat, p.lng]));
  }

  const smoothPath: LatLngTuple[] = [];

  const pointArr: LatLngTuple[] = points.map((p) => {
    return Array.isArray(p) ? p : [p.lat, p.lng];
  });

  smoothPath.push(pointArr[0]);

  for (let i = 0; i < pointArr.length - 1; i++) {
    const p0 = i === 0 ? pointArr[i] : pointArr[i - 1];
    const p1 = pointArr[i];
    const p2 = pointArr[i + 1];
    const p3 = i === pointArr.length - 2 ? pointArr[i + 1] : pointArr[i + 2];

    for (let t = 1; t <= granularity; t++) {
      const t_step = t / granularity;
      const t2 = t_step * t_step;
      const t3 = t2 * t_step;

      const newLat =
        0.5 *
        (2 * p1[0] +
          (-p0[0] + p2[0]) * t_step +
          (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
          (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);

      const newLng =
        0.5 *
        (2 * p1[1] +
          (-p0[1] + p2[1]) * t_step +
          (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
          (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);

      smoothPath.push([newLat, newLng]);
    }
  }

  return smoothPath;
}

export function calculateBearing(p1: LatLngTuple, p2: LatLngTuple): number {
  const [lat1, lon1] = p1;
  const [lat2, lon2] = p2;

  const toRadians = (deg: number) => deg * (Math.PI / 180);
  const toDegrees = (rad: number) => rad * (180 / Math.PI);

  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);
  const lonDiffRad = toRadians(lon2 - lon1);

  const y = Math.sin(lonDiffRad) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lonDiffRad);

  const bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

export function calculateLastBearing(path: Position[]): number {
  if (path.length < 2) {
    return 0;
  }

  const lastPoint = path[path.length - 1] as LatLngTuple;
  let secondLastPoint: LatLngTuple | null = null;

  for (let i = path.length - 2; i >= 0; i--) {
    const currentPoint = path[i] as LatLngTuple;
    if (currentPoint[0] !== lastPoint[0] || currentPoint[1] !== lastPoint[1]) {
      secondLastPoint = currentPoint;
      break;
    }
  }

  if (secondLastPoint) {
    return calculateBearing(secondLastPoint, lastPoint);
  }

  return 0;
}
