import { Continent } from "~/features/airport/model";
import type { Country } from "~/features/country/model";
import type { CataloguePostcard, PlacedPostcard } from "~/features/postcard/model";

const KNOWN_CONTINENTS = new Set<string>(Object.values(Continent));

export function toContinent(value: string | undefined): Continent | null {
  return value !== undefined && KNOWN_CONTINENTS.has(value) ? (value as Continent) : null;
}

export function placePostcards(postcards: CataloguePostcard[], countries: Country[]): PlacedPostcard[] {
  const byCode = new Map(countries.map((country) => [country.code, country]));

  return postcards.map((postcard) => ({
    ...postcard,
    continent: toContinent(byCode.get(postcard.country.code)?.continent),
  }));
}
