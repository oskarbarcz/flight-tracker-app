import { type ObjectSchema, object, string } from "yup";
import type { CreateAircraftRequest } from "~/state/api/request/operator.request";

export const aircraftSchema: ObjectSchema<CreateAircraftRequest> = object().shape({
  icaoCode: string()
    .required("ICAO code is required")
    .matches(/^[A-Z0-9]{3,4}$/, "ICAO code must be 3 or 4 characters"),
  shortName: string()
    .required("Short name is required")
    .min(2, "Short name must be at least 2 characters")
    .max(50, "Short name must be under 50 characters"),
  fullName: string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be under 100 characters"),
  registration: string()
    .required("Registration is required")
    .min(2, "Registration must be at least 2 characters")
    .max(20, "Registration must be under 20 characters"),
  selcal: string()
    .optional()
    .matches(/^[A-Z]{2}-[A-Z]{2}$/, "SELCAL must be in format XX-XX"),
  livery: string()
    .required("Livery name is required")
    .min(2, "Livery must be at least 2 characters")
    .max(100, "Livery must be under 100 characters"),
});
