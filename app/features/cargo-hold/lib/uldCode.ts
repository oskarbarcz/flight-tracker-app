import { UldBase, UldContour, type UldType } from "~/features/cargo-hold/model";

const REFRIGERATED_FAMILY = "R";

export type UldCode = {
  family: string;
  base: UldBase;
  contour: UldContour;
  refrigerated: boolean;
};

const bases = new Set<string>(Object.values(UldBase));
const contours = new Set<string>(Object.values(UldContour));

export function parseUldCode(code: string): UldCode | null {
  if (code.length < 3) {
    return null;
  }

  const family = code.charAt(0);
  const base = code.charAt(1);
  const contour = code.charAt(2);

  if (!bases.has(base) || !contours.has(contour)) {
    return null;
  }

  return {
    family,
    base: base as UldBase,
    contour: contour as UldContour,
    refrigerated: family === REFRIGERATED_FAMILY,
  };
}

export function isRefrigeratedType(type: UldType): boolean {
  return parseUldCode(type)?.refrigerated === true;
}

export function baseOfType(type: UldType): UldBase | null {
  return parseUldCode(type)?.base ?? null;
}

export function contourOfType(type: UldType): UldContour | null {
  return parseUldCode(type)?.contour ?? null;
}
