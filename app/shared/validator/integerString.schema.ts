import { string } from "yup";

export function optionalIntegerString(min?: number, max?: number) {
  const rangeMessage =
    min !== undefined && max !== undefined
      ? `Must be a whole number between ${min} and ${max}`
      : min !== undefined
        ? `Must be a whole number ${min} or greater`
        : "Must be a whole number";

  return string()
    .ensure()
    .test("optional-integer", rangeMessage, (value) => {
      if (value === "") return true;
      const parsed = Number(value);
      if (!Number.isInteger(parsed)) return false;
      if (min !== undefined && parsed < min) return false;
      if (max !== undefined && parsed > max) return false;
      return true;
    });
}

export function requiredIntegerString(missingMessage: string, min?: number, max?: number) {
  return optionalIntegerString(min, max).required(missingMessage);
}
