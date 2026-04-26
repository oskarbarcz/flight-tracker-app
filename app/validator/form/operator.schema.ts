import { number, type ObjectSchema, object, string } from "yup";
import { Continent, type CreateOperatorFormData, OperatorType } from "~/models";

const optionalUrl = string()
  .ensure()
  .test("is-url", "Must be a valid URL", (value) => {
    if (!value) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  });

const hubsSchema = string()
  .ensure()
  .test("are-iata-codes", "Hubs must be comma-separated 3-letter IATA codes", (value) => {
    if (!value || value.trim().length === 0) return true;
    return value
      .split(",")
      .map((code) => code.trim())
      .every((code) => /^[A-Z]{3}$/.test(code));
  });

export const createOperatorSchema: ObjectSchema<CreateOperatorFormData> = object().shape({
  icaoCode: string()
    .required("ICAO code is required")
    .matches(/^[A-Z]{3}$/, "ICAO code must be exactly 3 uppercase letters"),
  iataCode: string()
    .required("IATA code is required")
    .matches(/^[A-Z0-9]{2}$/, "IATA code must be exactly 2 uppercase letters or digits"),
  shortName: string()
    .required("Short name is required")
    .min(2, "Short name must be at least 2 characters")
    .max(50, "Short name must be under 50 characters"),
  fullName: string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be under 100 characters"),
  callsign: string()
    .required("Callsign is required")
    .min(2, "Callsign must be at least 2 characters")
    .max(50, "Callsign must be under 50 characters"),
  avgFleetAge: number()
    .typeError("Average fleet age must be a number")
    .required("Average fleet age is required")
    .min(0, "Average fleet age cannot be negative")
    .max(100, "Average fleet age must be under 100"),
  logoUrl: optionalUrl,
  backgroundUrl: optionalUrl,
  type: string<OperatorType>()
    .oneOf(Object.values(OperatorType), "Invalid operator type")
    .required("Operator type is required"),
  continent: string<Continent>().oneOf(Object.values(Continent), "Invalid continent").required("Continent is required"),
  hubs: hubsSchema,
});
