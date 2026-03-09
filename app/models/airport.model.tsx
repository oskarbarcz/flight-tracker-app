export enum Continent {
  Africa = "africa",
  Asia = "asia",
  Europe = "europe",
  NorthAmerica = "north_america",
  Oceania = "oceania",
  SouthAmerica = "south_america",
}

export function allContinents(): Continent[] {
  return [
    Continent.Europe,
    Continent.NorthAmerica,
    Continent.SouthAmerica,
    Continent.Africa,
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
