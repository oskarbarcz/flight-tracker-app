import { number, object, ObjectSchema, string } from "yup";
import { AirportGeneralFormData } from "~/components/Forms/Airport/AirportGeneralFormSection";
import { AirportLocationData } from "~/components/Forms/Airport/AirportLocationFormSection";
import { Continent } from "~/models";

const timezoneSchema = string().test(
  "is-valid-timezone",
  "Invalid timezone",
  (value) => {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: value! });
      return true;
    } catch {
      return false;
    }
  },
);

export const createAirportGeneralSchema: ObjectSchema<AirportGeneralFormData> =
  object().shape({
    iataCode: string()
      .required("IATA code is required")
      .matches(/^[A-Z]{3}$/, "IATA code must be exactly 3 uppercase letters"),
    icaoCode: string()
      .required("ICAO code is required")
      .matches(/^[A-Z0-9]{4}$/, "ICAO code must be exactly 4 characters"),
    name: string()
      .required("Airport name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be under 100 characters"),
  });

export const createAirportLocationSchema: ObjectSchema<AirportLocationData> =
  object().shape({
    city: string()
      .required("City is required")
      .min(2, "City must be at least 2 characters")
      .max(100, "City must be under 100 characters"),
    country: string()
      .required("Country is required")
      .min(2, "Country must be at least 2 characters")
      .max(100, "Country must be under 100 characters"),
    longitude: number().required("Longitude is required").min(-180).max(180),
    latitude: number().required("Latitude is required").min(-90).max(90),
    continent: string()
      .required("Continent is required")
      .oneOf(Object.values(Continent)),
    timezone: timezoneSchema.required(),
  });
