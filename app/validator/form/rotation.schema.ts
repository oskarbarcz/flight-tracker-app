import { type ObjectSchema, object, string } from "yup";
import type { CreateRotationRequest } from "~/state/api/request/operator.request";

export const createRotationSchema: ObjectSchema<CreateRotationRequest> = object().shape({
  name: string()
    .required("Rotation name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be under 50 characters"),
  pilotId: string().required("Captain pilot is required").uuid("Invalid pilot ID format"),
});
