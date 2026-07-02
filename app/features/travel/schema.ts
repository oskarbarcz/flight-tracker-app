import { type ObjectSchema, object, string } from "yup";
import type { InitiateTravelFormData } from "~/features/travel/form";

export const initiateTravelSchema: ObjectSchema<InitiateTravelFormData> = object({
  destinationAirportId: string().required("Destination airport is required").uuid("Destination airport is required"),
});
