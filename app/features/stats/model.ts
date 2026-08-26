import type { CountryRef } from "~/features/country/model";

export type LifetimeTotals = {
  distanceNm: number;
  airborneMinutes: number;
  blockMinutes: number;
  flights: number;
  cycles: number;
  fuelBurned: number;
};

export type LifetimeRecords = {
  longestFlightDistanceNm: number;
  longestFlightMinutes: number;
  firstFlightAt: string | null;
  lastFlightAt: string | null;
};

export type MostFlownAirline = {
  operatorId: string;
  icaoCode: string;
  shortName: string;
  fullName: string;
  logoUrl: string | null;
};

export type MostVisitedAirport = {
  airportId: string;
  icaoCode: string;
  name: string;
  city: string;
  country: CountryRef;
  visits: number;
};

export type GeographySummary = {
  airports: number;
  countries: number;
  continents: number;
  mostVisitedAirport: MostVisitedAirport | null;
};

export type StatsSummary = {
  totals: LifetimeTotals;
  records: LifetimeRecords;
  mostFlownAircraftType: string | null;
  mostFlownAirline: MostFlownAirline | null;
  geography: GeographySummary;
};

export type PeriodTotals = {
  distanceNm: number;
  airborneMinutes: number;
  blockMinutes: number;
  flights: number;
  fuelBurned: number;
};

export type UnlockedAirport = {
  icaoCode: string;
  firstVisitAt: string;
};

export type PeriodUnlocked = {
  airports: UnlockedAirport[];
  aircraftTypes: string[];
};

export type PeriodComparison = {
  current: PeriodTotals;
  previous: PeriodTotals;
  unlocked: PeriodUnlocked;
};

export type PeriodStats = {
  week: PeriodComparison;
  month: PeriodComparison;
  year: PeriodComparison;
};

export type ActivityDay = {
  day: string;
  flights: number;
  airborneMinutes: number;
  blockMinutes: number;
};

export type AircraftTypeStat = {
  type: string;
  flights: number;
  distanceNm: number;
  airborneMinutes: number;
  blockMinutes: number;
  firstFlownAt: string;
  lastFlownAt: string;
};
