import { type ObjectSchema, object, string } from "yup";
import type { CreateAircraftRequest, CreateRepositionRequest } from "~/features/operator/request";

export const aircraftSchema: ObjectSchema<CreateAircraftRequest> = object().shape({
  type: string().required("Aircraft type is required"),
  registration: string()
    .required("Registration is required")
    .min(2, "Registration must be at least 2 characters")
    .max(20, "Registration must be under 20 characters"),
  selcal: string()
    .required("SELCAL is required")
    .matches(/^[A-Z]{2}-[A-Z]{2}$/, "SELCAL must be in format XX-XX"),
  livery: string()
    .required("Livery name is required")
    .min(2, "Livery must be at least 2 characters")
    .max(100, "Livery must be under 100 characters"),
});

export const repositionSchema: ObjectSchema<CreateRepositionRequest> = object().shape({
  destinationAirportId: string().uuid("Invalid airport").required("Destination is required"),
});
