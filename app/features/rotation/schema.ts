import { date, type ObjectSchema, object, ref, string } from "yup";
import type { LegFormData } from "~/features/rotation/form";
import type { CreateRotationRequest } from "~/features/rotation/request";

export const createRotationSchema: ObjectSchema<CreateRotationRequest> = object().shape({
  name: string()
    .required("Rotation name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be under 50 characters"),
  pilotId: string().required("Assigned pilot is required").uuid("Invalid pilot ID format"),
});

export const legSchema: ObjectSchema<LegFormData> = object({
  flightNumber: string()
    .required("Flight number is required")
    .min(2, "Flight number must be at least 2 characters")
    .max(10, "Flight number must be under 10 characters"),
  departureId: string().required("Departure airport is required").uuid("Invalid airport"),
  arrivalId: string()
    .required("Arrival airport is required")
    .uuid("Invalid airport")
    .notOneOf([ref("departureId")], "Arrival must differ from departure"),
  offBlockTime: date().required("Off-block time is required"),
  onBlockTime: date()
    .required("On-block time is required")
    .min(ref("offBlockTime"), "On-block must be later than off-block"),
});
