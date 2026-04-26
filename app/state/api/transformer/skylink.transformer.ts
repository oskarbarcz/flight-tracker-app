import { Continent } from "~/models";
import type { CreateAirportFormData } from "~/models/form/airport.form";
import type { SkyLinkAirportResponse } from "~/state/api/request/skylink.request";

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
  };
}
