import type { Coordinates } from "~/shared/models/coordinates";

const MINIMUM_OUTLINE_POINTS = 3;

export function hasOutline(shape: Coordinates[] | null): boolean {
  return shape !== null && shape.length >= MINIMUM_OUTLINE_POINTS;
}
