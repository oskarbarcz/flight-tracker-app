import { number, type ObjectSchema, object, string } from "yup";
import { LightingType, SurfaceType } from "~/models";
import type { CreateRunwayFormData } from "~/models/form/runway.form";

const optionalIntegerString = (min?: number, max?: number) =>
  string()
    .defined()
    .test("optional-integer", "Must be a whole number in range", (value) => {
      if (value === "" || value === undefined || value === null) return true;
      const n = Number(value);
      if (!Number.isInteger(n)) return false;
      if (min !== undefined && n < min) return false;
      if (max !== undefined && n > max) return false;
      return true;
    });

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
});
