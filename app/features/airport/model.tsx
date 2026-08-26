import type { CountryRef } from "~/features/country/model";
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
  country: CountryRef;
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

export const DEFAULT_WEATHER_SOURCE = WeatherSource.AviationWeatherGov;

export function resolveWeatherSource(source: WeatherSource | null | undefined): WeatherSource {
  return source && allWeatherSources().includes(source) ? source : DEFAULT_WEATHER_SOURCE;
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

export enum OsmResource {
  Airport = "airport",
  Runway = "runway",
  Terminal = "terminal",
  ParkingPosition = "parkingPosition",
  Gate = "gate",
}

export function allOsmResources(): OsmResource[] {
  return [OsmResource.Airport, OsmResource.Runway, OsmResource.Terminal, OsmResource.ParkingPosition, OsmResource.Gate];
}

export enum OsmChangeStatus {
  Added = "added",
  Updated = "updated",
  Removed = "removed",
  NotChanged = "not-changed",
}

export enum OsmPushOutcome {
  Added = "added",
  Updated = "updated",
  Removed = "removed",
  Skipped = "skipped",
  Failed = "failed",
}

export type OsmFieldChange = {
  field: string;
  current: unknown;
  proposed: unknown;
};

export type OsmProposedChange = {
  key: string;
  resource: OsmResource;
  label: string;
  status: OsmChangeStatus;
  fields: OsmFieldChange[];
  requires: string[];
};

export type OsmProposalSummary = {
  added: number;
  removed: number;
  updated: number;
  notChanged: number;
};

export type AirportOsmProposal = {
  airportId: string;
  icaoCode: string;
  source: string;
  providerName: string | null;
  pulledAt: string;
  fromCache: boolean;
  summary: OsmProposalSummary;
  changes: OsmProposedChange[];
};

export type OsmPushTotals = {
  added: number;
  removed: number;
  updated: number;
  skipped: number;
  failed: number;
};

export type OsmPushedChange = {
  key: string;
  outcome: OsmPushOutcome;
  reason?: string | null;
};

export type AirportOsmPushResult = {
  airportId: string;
  icaoCode: string;
  totals: OsmPushTotals;
  changes: OsmPushedChange[];
};
