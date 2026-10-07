import { type ObjectSchema, object, string } from "yup";
import type { RejectChangeRequestFormData } from "~/features/change-request/form";

export function rejectChangeRequestSchema(): ObjectSchema<RejectChangeRequestFormData> {
  return object({
    rejectionReason: string()
      .trim()
      .required("Rejection reason is required")
      .min(3, "Tell the crew member why (at least 3 characters)"),
  });
}
