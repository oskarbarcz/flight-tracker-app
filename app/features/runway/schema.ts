import { number, type ObjectSchema, object, string } from "yup";
import { LightingType, SurfaceType } from "~/features/runway";
import type { CreateRunwayFormData } from "~/features/runway/form";
import { optionalIntegerString, requiredIntegerString } from "~/shared/validator/integerString.schema";

export const createRunwaySchema: ObjectSchema<CreateRunwayFormData> = object().shape({
  designator: string()
    .required("Designator is required")
    .matches(/^(0[1-9]|[12]\d|3[0-6])[LCR]?$/, "Designator must be 01–36 with optional L/C/R suffix"),
  length: requiredIntegerString("Length is required", 1),
  width: requiredIntegerString("Width is required", 1),
  displace: optionalIntegerString(0),
  trueHeading: optionalIntegerString(0, 359),
  magneticHeading: requiredIntegerString("Magnetic heading is required", 0, 359),
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
