import { Continent } from "~/models";

export function translateContinent(continent: Continent): string {
  switch (continent) {
    case Continent.Africa:
      return "Africa";
    case Continent.Asia:
      return "Asia";
    case Continent.Europe:
      return "Europe";
    case Continent.NorthAmerica:
      return "North America";
    case Continent.Oceania:
      return "Oceania";
    case Continent.SouthAmerica:
      return "South America";
  }
}
