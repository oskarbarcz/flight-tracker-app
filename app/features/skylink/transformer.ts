import { Continent } from "~/features/airport";
import type { CreateAirportFormData } from "~/features/airport/form";
import type { Country } from "~/features/country/model";
import type { SkyLinkAirportResponse } from "~/features/skylink/request";

function resolveCountryCode(countryName: string, countries: Country[]): string {
  const normalized = countryName.trim().toLowerCase();
  const match = countries.find((country) => country.name.toLowerCase() === normalized);

  return match?.code ?? "";
}

export function skyLinkToFormData(input: SkyLinkAirportResponse, countries: Country[]): CreateAirportFormData {
  return {
    icaoCode: input.icao,
    iataCode: input.iata,
    name: input.name,
    city: input.city,
    country: resolveCountryCode(input.country, countries),
    timezone: input.timezone,
    continent: Continent.Europe,
    latitude: Number.parseFloat(input.latitude),
    longitude: Number.parseFloat(input.longitude),
    shape: null,
  };
}
