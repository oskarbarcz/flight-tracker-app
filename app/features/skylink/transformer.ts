import type { CreateAirportFormData } from "~/features/airport/form";
import type { SkyLinkAirportResponse } from "~/features/skylink/request";
import { Continent } from "~/models";

export function skyLinkToFormData(input: SkyLinkAirportResponse): CreateAirportFormData {
  return {
    icaoCode: input.icao,
    iataCode: input.iata,
    name: input.name,
    city: input.city,
    country: input.country,
    timezone: input.timezone,
    continent: Continent.Europe,
    latitude: Number.parseFloat(input.latitude),
    longitude: Number.parseFloat(input.longitude),
    shape: null,
  };
}
