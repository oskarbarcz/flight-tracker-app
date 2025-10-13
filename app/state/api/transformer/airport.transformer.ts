import { CreateAirportFormData } from "~/models/form/airport.form";
import { Continent } from "~/models";
import {
  CreateAirportRequest,
  GetAirportResponse,
} from "~/state/api/model/airport.dto";

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
    isGeneralSubmitted: false,
    isLocationSubmitted: false,
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
