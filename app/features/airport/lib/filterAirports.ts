import { searchAirports } from "~/features/airport/lib/searchAirports";
import type { Airport, Continent, DataQuality } from "~/features/airport/model";

export type AirportFilters = {
  search: string;
  qualities: DataQuality[];
  continent: Continent | "";
  country: string;
};

export function isSearching(filters: AirportFilters): boolean {
  return filters.search.trim() !== "";
}

export function isFiltering(filters: AirportFilters): boolean {
  return isSearching(filters) || filters.qualities.length > 0 || filters.continent !== "" || filters.country !== "";
}

export function filterAirports(airports: Airport[], filters: AirportFilters): Airport[] {
  const searching = isSearching(filters);
  const matched = searching ? searchAirports(airports, filters.search, airports.length) : airports;

  return matched.filter(
    (airport) =>
      (filters.continent === "" || airport.continent === filters.continent) &&
      (filters.country === "" || airport.country.code === filters.country) &&
      (searching || filters.qualities.length === 0 || filters.qualities.includes(airport.dataQuality)),
  );
}

export function sortAirports(airports: Airport[]): Airport[] {
  return [...airports].sort(
    (left, right) => left.country.name.localeCompare(right.country.name) || left.iataCode.localeCompare(right.iataCode),
  );
}
