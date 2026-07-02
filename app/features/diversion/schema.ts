import { boolean, date, mixed, type ObjectSchema, object, string } from "yup";
import type { ReportDiversionFormData } from "~/features/diversion/form";
import { DiversionReason, DiversionSeverity } from "~/features/diversion/model";

export const reportDiversionSchema: ObjectSchema<ReportDiversionFormData> = object({
  severity: mixed<DiversionSeverity>().oneOf(Object.values(DiversionSeverity)).required("Severity is required"),
  reason: mixed<DiversionReason>().oneOf(Object.values(DiversionReason)).required("Reason is required"),
  freeText: string().required("Description is required").min(3, "Please provide more detail"),
  airportId: string().required("Diversion airport is required").uuid("Diversion airport is required"),
  notifySecurityOnGround: boolean().required().default(false),
  notifyMedicalOnGround: boolean().required().default(false),
  notifyFirefightersOnGround: boolean().required().default(false),
  estimatedTimeAtDestination: date().typeError("Invalid date").required("Estimated time at destination is required"),
});
