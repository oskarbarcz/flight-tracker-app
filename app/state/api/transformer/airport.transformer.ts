import type { CreateAirportFormData } from "~/models/form/airport.form";
import type { CreateAirportRequest, GetAirportResponse } from "~/state/api/request/airport.request";

export function formDataToApiFormat(input: CreateAirportFormData): CreateAirportRequest {
  return {
    icaoCode: input.icaoCode.trim().toUpperCase(),
    iataCode: input.iataCode.trim().toUpperCase(),
    name: input.name.trim(),
    city: input.city.trim(),
    country: input.country.trim(),
    timezone: input.timezone.trim(),
    continent: input.continent,
    location: {
      latitude: Number(input.latitude),
      longitude: Number(input.longitude),
    },
  };
}

export function airportToFormData(input: GetAirportResponse): CreateAirportFormData {
  return {
    icaoCode: input.icaoCode,
    iataCode: input.iataCode,
    name: input.name,
    city: input.city,
    country: input.country,
    timezone: input.timezone,
    continent: input.continent,
    latitude: input.location.latitude,
    longitude: input.location.longitude,
  };
}
