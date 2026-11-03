import { number, object } from "yup";

export const fixFuelReportSchema = object({
  actualOnBoard: number()
    .transform((value, original) => (original === "" ? undefined : value))
    .typeError("Fuel on board must be a number")
    .required("Fuel on board is required")
    .min(0, "Cannot be negative")
    .max(999.999, "Cannot be more than 999.999 t")
    .test(
      "max-decimals",
      "Maximum 3 decimal places allowed",
      (value) => value === undefined || Math.round(value * 1000) / 1000 === value,
    ),
});
