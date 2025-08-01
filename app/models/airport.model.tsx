export enum Continent {
  Africa = "africa",
  Asia = "asia",
  Europe = "europe",
  NorthAmerica = "north_america",
  Oceania = "oceania",
  SouthAmerica = "south_america",
}

export function continentToDisplayName(continent: Continent): string {
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

export function allContinents(): Continent[] {
  return [
    Continent.Europe,
    Continent.NorthAmerica,
    Continent.SouthAmerica,
    Continent.Asia,
    Continent.Oceania,
  ];
}

export type Airport = {
  id: string;
  icaoCode: string;
  iataCode: string;
  city: string;
  name: string;
  country: string;
  timezone: string;
  continent: Continent;
  location: {
    longitude: number;
    latitude: number;
  };
};
