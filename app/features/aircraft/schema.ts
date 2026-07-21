import { type ObjectSchema, object, string } from "yup";
import type { CreateRepositionRequest } from "~/features/operator/request";

export const etopsThresholdMinutesOptions = [60, 75, 90, 120, 180] as const;

export const notEtopsCertified = "none";

export type AircraftIdentityFormValues = {
  type: string;
  registration: string;
  selcal: string;
};

export type AircraftLifecycleFormValues = {
  baseAirportId: string;
  livery: string;
  etopsThresholdMinutes: string;
};

const etopsThresholdFormValues = [
  notEtopsCertified,
  ...etopsThresholdMinutesOptions.map((minutes) => minutes.toString()),
];

export const aircraftIdentitySchema: ObjectSchema<AircraftIdentityFormValues> = object().shape({
  type: string().required("Aircraft type is required"),
  registration: string()
    .required("Registration is required")
    .min(2, "Registration must be at least 2 characters")
    .max(20, "Registration must be under 20 characters"),
  selcal: string()
    .defined()
    .default("")
    .matches(/^[A-Z]{2}-[A-Z]{2}$/, { message: "SELCAL must be in format XX-XX", excludeEmptyString: true }),
});

export const aircraftLifecycleSchema: ObjectSchema<AircraftLifecycleFormValues> = object().shape({
  baseAirportId: string().required("Base airport is required"),
  livery: string()
    .defined()
    .default("")
    .max(100, "Livery must be under 100 characters")
    .test("livery-min-length", "Livery must be at least 2 characters", (value) => !value || value.length >= 2),
  etopsThresholdMinutes: string()
    .defined()
    .default(notEtopsCertified)
    .oneOf(etopsThresholdFormValues, "Invalid ETOPS threshold"),
});

export const repositionSchema: ObjectSchema<CreateRepositionRequest> = object().shape({
  destinationAirportId: string().uuid("Invalid airport").required("Destination is required"),
});
