import type { Coordinates } from "~/shared/models/coordinates";

export function isCoordinates(value: unknown): value is Coordinates {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Coordinates).latitude === "number" &&
    typeof (value as Coordinates).longitude === "number"
  );
}

export function pointOf(value: unknown): Coordinates | null {
  return isCoordinates(value) ? value : null;
}

export function polygonOf(value: unknown): Coordinates[] | null {
  return Array.isArray(value) && value.length > 0 && value.every(isCoordinates) ? value : null;
}

export function isSameValue(left: unknown, right: unknown): boolean {
  return JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
}
