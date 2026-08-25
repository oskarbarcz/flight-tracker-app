import { baseOfType, contourOfType } from "~/features/cargo-hold/lib/uldCode";
import type { HoldPosition } from "~/features/cargo-hold/model";
import { UldType } from "~/features/cargo-hold/model";

export function acceptedTypes(position: HoldPosition): UldType[] {
  const bases = new Set(position.acceptedBases);
  const contours = new Set(position.acceptedContours);

  return Object.values(UldType).filter((type) => {
    const base = baseOfType(type);
    const contour = contourOfType(type);
    return base !== null && contour !== null && bases.has(base) && contours.has(contour);
  });
}

export function acceptsType(position: HoldPosition, type: UldType): boolean {
  return acceptedTypes(position).includes(type);
}
