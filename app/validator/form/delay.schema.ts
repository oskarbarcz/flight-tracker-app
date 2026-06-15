import { mixed, number, type ObjectSchema, object, string } from "yup";
import { DelayReasonCode } from "~/models/delay.model";
import type { FileDelayReportFormData, RejectDelayReportFormData } from "~/models/form/delay.form";

export function fileDelayReportSchema(maxMinutes: number): ObjectSchema<FileDelayReportFormData> {
  return object({
    reasonCode: mixed<DelayReasonCode>().oneOf(Object.values(DelayReasonCode)).required("Reason is required"),
    delayMinutes: number()
      .typeError("Delay minutes must be a number")
      .required("Delay minutes is required")
      .integer("Must be a whole number")
      .min(1, "At least 1 minute")
      .max(maxMinutes, `At most ${maxMinutes} unallocated minute${maxMinutes === 1 ? "" : "s"} remaining`),
    freeText: string().defined().default(""),
  });
}

export function rejectDelayReportSchema(): ObjectSchema<RejectDelayReportFormData> {
  return object({
    rejectionReason: string()
      .trim()
      .required("Rejection reason is required")
      .min(3, "Give the crew a clear reason (at least 3 characters)"),
  });
}
