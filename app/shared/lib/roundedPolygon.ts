import type { Coordinates } from "~/shared/models/coordinates";

export type Point2D = { x: number; y: number };

function cornerTrim(prev: Point2D, cur: Point2D, next: Point2D, radius: number) {
  const inX = cur.x - prev.x;
  const inY = cur.y - prev.y;
  const outX = next.x - cur.x;
  const outY = next.y - cur.y;
  const inLength = Math.hypot(inX, inY) || 1;
  const outLength = Math.hypot(outX, outY) || 1;
  const trim = Math.min(radius, inLength / 2, outLength / 2);
  return {
    start: { x: cur.x - (inX / inLength) * trim, y: cur.y - (inY / inLength) * trim },
    end: { x: cur.x + (outX / outLength) * trim, y: cur.y + (outY / outLength) * trim },
  };
}

export function roundedPolygonPath(points: Point2D[], radius: number): string {
  if (points.length < 3) return "";
  if (radius <= 0) return `M${points.map((p) => `${p.x},${p.y}`).join(" L")} Z`;

  const count = points.length;
  let path = "";
  for (let index = 0; index < count; index++) {
    const prev = points[(index - 1 + count) % count];
    const cur = points[index];
    const next = points[(index + 1) % count];
    const { start, end } = cornerTrim(prev, cur, next, radius);
    path +=
      index === 0 ? `M${start.x.toFixed(2)},${start.y.toFixed(2)}` : ` L${start.x.toFixed(2)},${start.y.toFixed(2)}`;
    path += ` Q${cur.x.toFixed(2)},${cur.y.toFixed(2)} ${end.x.toFixed(2)},${end.y.toFixed(2)}`;
  }
  return `${path} Z`;
}

export function roundedPolygonPoints(points: Point2D[], radius: number, samplesPerCorner = 6): Point2D[] {
  if (points.length < 3 || radius <= 0) return points;

  const count = points.length;
  const result: Point2D[] = [];
  for (let index = 0; index < count; index++) {
    const prev = points[(index - 1 + count) % count];
    const cur = points[index];
    const next = points[(index + 1) % count];
    const { start, end } = cornerTrim(prev, cur, next, radius);
    result.push(start);
    for (let step = 1; step < samplesPerCorner; step++) {
      const t = step / samplesPerCorner;
      const inverse = 1 - t;
      result.push({
        x: inverse * inverse * start.x + 2 * inverse * t * cur.x + t * t * end.x,
        y: inverse * inverse * start.y + 2 * inverse * t * cur.y + t * t * end.y,
      });
    }
    result.push(end);
  }
  return result;
}

export function roundedLatLngPolygon(shape: Coordinates[], radiusFraction = 0.06): [number, number][] {
  if (shape.length < 3) return shape.map((point) => [point.latitude, point.longitude]);

  const meanLatitude = shape.reduce((sum, point) => sum + point.latitude, 0) / shape.length;
  const longitudeScale = Math.cos((meanLatitude * Math.PI) / 180) || 1;
  const projected = shape.map((point) => ({ x: point.longitude * longitudeScale, y: point.latitude }));

  const xs = projected.map((point) => point.x);
  const ys = projected.map((point) => point.y);
  const spanX = Math.max(...xs) - Math.min(...xs) || 1;
  const spanY = Math.max(...ys) - Math.min(...ys) || 1;
  const radius = radiusFraction * Math.min(spanX, spanY);

  return roundedPolygonPoints(projected, radius).map((point) => [point.y, point.x / longitudeScale]);
}
