import type { CreateAirportFormData } from "~/features/airport/form";
import type { CreateAirportRequest, GetAirportResponse } from "~/features/airport/request";

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
    shape: input.shape && input.shape.length > 0 ? input.shape : null,
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
    shape: input.shape ?? null,
  };
}
