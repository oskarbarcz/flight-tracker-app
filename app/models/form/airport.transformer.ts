import { CreateAirportFormData } from "~/models/form/airport.form";
import { Continent, CreateAirportRequest, GetAirportResponse } from "~/models";

export function formDataToApiFormat(
  input: CreateAirportFormData,
): CreateAirportRequest {
  return {
    ...input.general,
    city: input.location.city,
    country: input.location.country,
    continent: input.location.continent as Continent,
    timezone: input.location.timezone,
    location: {
      latitude: input.location.latitude,
      longitude: input.location.longitude,
    },
  };
}

export function airportToFormData(
  input: GetAirportResponse,
): CreateAirportFormData {
  return {
    general: {
      icaoCode: input.icaoCode,
      iataCode: input.iataCode,
      name: input.name,
    },
    location: {
      city: input.city,
      country: input.country,
      timezone: input.timezone,
      continent: input.continent,
      latitude: input.location.latitude,
      longitude: input.location.longitude,
    },
  };
}
