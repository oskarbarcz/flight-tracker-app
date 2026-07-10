import type { Airport } from "~/features/airport";
import { keywordRank, matchesKeywords } from "~/shared/lib/keywordSearch";

function keywordsOf(airport: Airport): string[] {
  return [airport.iataCode, airport.icaoCode, airport.name, airport.city];
}

export function searchAirports(airports: Airport[], query: string, limit = 8): Airport[] {
  const normalized = query.trim().toLowerCase();
  if (normalized === "") {
    return [];
  }
  return airports
    .filter((airport) => matchesKeywords(keywordsOf(airport), normalized))
    .sort((a, b) => keywordRank(keywordsOf(a), normalized) - keywordRank(keywordsOf(b), normalized))
    .slice(0, limit);
}
