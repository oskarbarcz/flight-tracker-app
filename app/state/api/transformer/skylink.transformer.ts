import { Continent, SkyLinkAirportResponse } from "~/models";
import { CreateAirportFormData } from "~/models/form/airport.form";

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
