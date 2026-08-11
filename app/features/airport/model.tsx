import type { Coordinates } from "~/shared/models/coordinates";

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
  shape: Coordinates[] | null;
};

export enum WeatherSource {
  AviationWeatherGov = "aviation_weather_gov",
  SayIntentions = "say_intentions",
}

export function allWeatherSources(): WeatherSource[] {
  return [WeatherSource.AviationWeatherGov, WeatherSource.SayIntentions];
}

export enum WeatherInformationType {
  Atis = "atis",
  Metar = "metar",
  Taf = "taf",
}

export function allWeatherInformationTypes(): WeatherInformationType[] {
  return [WeatherInformationType.Metar, WeatherInformationType.Taf, WeatherInformationType.Atis];
}

export type AirportWeatherReport = {
  id: string;
  source: WeatherSource;
  informationType: WeatherInformationType;
  content: string;
  lastFetched: string;
};
