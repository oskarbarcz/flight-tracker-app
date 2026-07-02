import type { Coordinates } from "~/models/runway.model";

type Point = { x: number; y: number };

function toPoint(c: Coordinates): Point {
  return { x: c.longitude, y: c.latitude };
}

function orient(a: Point, b: Point, c: Point): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function segmentsCross(a: Point, b: Point, c: Point, d: Point): boolean {
  const o1 = orient(a, b, c);
  const o2 = orient(a, b, d);
  const o3 = orient(c, d, a);
  const o4 = orient(c, d, b);
  return ((o1 > 0 && o2 < 0) || (o1 < 0 && o2 > 0)) && ((o3 > 0 && o4 < 0) || (o3 < 0 && o4 > 0));
}

export function newEdgeCrossesPolyline(vertices: Coordinates[], candidate: Coordinates): boolean {
  if (vertices.length < 2) return false;
  const a = toPoint(vertices[vertices.length - 1]);
  const b = toPoint(candidate);
  for (let i = 0; i < vertices.length - 2; i++) {
    const c = toPoint(vertices[i]);
    const d = toPoint(vertices[i + 1]);
    if (segmentsCross(a, b, c, d)) return true;
  }
  return false;
}

export function closingEdgeCrosses(vertices: Coordinates[]): boolean {
  if (vertices.length < 4) return false;
  const a = toPoint(vertices[vertices.length - 1]);
  const b = toPoint(vertices[0]);
  for (let i = 1; i < vertices.length - 2; i++) {
    const c = toPoint(vertices[i]);
    const d = toPoint(vertices[i + 1]);
    if (segmentsCross(a, b, c, d)) return true;
  }
  return false;
}
