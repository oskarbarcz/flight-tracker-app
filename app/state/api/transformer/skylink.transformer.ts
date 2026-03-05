import { Continent, type SkyLinkAirportResponse } from "~/models";
import type { CreateAirportFormData } from "~/models/form/airport.form";

export function skyLinkToFormData(
  input: SkyLinkAirportResponse,
): CreateAirportFormData {
  return {
    isLocationSubmitted: false,
    isGeneralSubmitted: false,
    general: {
      icaoCode: input.icao,
      iataCode: input.iata,
      name: input.name,
    },
    location: {
      city: input.city,
      country: input.country,
      timezone: input.timezone,
      continent: Continent.Europe,
      latitude: Number.parseFloat(input.latitude),
      longitude: Number.parseFloat(input.longitude),
    },
  };
}
