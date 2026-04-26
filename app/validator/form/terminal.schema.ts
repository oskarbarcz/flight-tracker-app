import { number, type ObjectSchema, object, string } from "yup";
import type { CreateTerminalFormData } from "~/models/form/terminal.form";

export const createTerminalSchema: ObjectSchema<CreateTerminalFormData> = object().shape({
  shortName: string().required("Short name is required").max(8, "Short name must be at most 8 characters"),
  fullName: string().required("Full name is required").max(128, "Full name must be at most 128 characters"),
  averageTaxiTime: number()
    .required("Average taxi time is required")
    .integer("Must be a whole number")
    .min(0, "Must be 0 or more"),
  operatorCodes: string()
    .default("")
    .test("operator-codes", "Each code must be 2–4 letters or digits", (value) => {
      if (!value) return true;
      const codes = value
        .split(/[\s,]+/)
        .map((c) => c.trim())
        .filter(Boolean);
      return codes.every((c) => /^[A-Za-z0-9]{2,4}$/.test(c));
    }),
  text: string().default(""),
});
