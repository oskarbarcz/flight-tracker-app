import { number, type ObjectSchema, object, string } from "yup";
import type { CreateRunwayFormData } from "~/features/runway/form";
import { LightingType, SurfaceType } from "~/models";

const optionalIntegerString = (min?: number, max?: number) => {
  const rangeMessage =
    min !== undefined && max !== undefined
      ? `Must be a whole number between ${min} and ${max}`
      : min !== undefined
        ? `Must be a whole number ${min} or greater`
        : "Must be a whole number";

  return string()
    .ensure()
    .test("optional-integer", rangeMessage, (value) => {
      if (value === "") return true;
      const n = Number(value);
      if (!Number.isInteger(n)) return false;
      if (min !== undefined && n < min) return false;
      if (max !== undefined && n > max) return false;
      return true;
    });
};

export const createRunwaySchema: ObjectSchema<CreateRunwayFormData> = object().shape({
  designator: string()
    .required("Designator is required")
    .matches(/^(0[1-9]|[12]\d|3[0-6])[LCR]?$/, "Designator must be 01–36 with optional L/C/R suffix"),
  length: number()
    .required("Length is required")
    .integer("Must be a whole number")
    .min(1, "Length must be at least 1m"),
  width: number().required("Width is required").integer("Must be a whole number").min(1, "Width must be at least 1m"),
  displace: optionalIntegerString(0),
  trueHeading: optionalIntegerString(0, 359),
  magneticHeading: number()
    .required("Magnetic heading is required")
    .integer("Must be a whole number")
    .min(0, "Must be 0–359")
    .max(359, "Must be 0–359"),
  elevation: optionalIntegerString(),
  surfaceType: string<SurfaceType>().required("Surface type is required").oneOf(Object.values(SurfaceType)),
  lightingType: string<LightingType>().required("Lighting type is required").oneOf(Object.values(LightingType)),
  latitude: number()
    .required("Latitude is required")
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: number()
    .required("Longitude is required")
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
});
