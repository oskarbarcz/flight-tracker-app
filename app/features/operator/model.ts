import type { Continent } from "~/models/airport.model";

export enum OperatorType {
  Legacy = "legacy",
  LowCost = "low_cost",
  Charter = "charter",
  GovernmentMilitary = "government_military",
}

export enum Alliance {
  StarAlliance = "star_alliance",
  SkyTeam = "sky_team",
  Oneworld = "oneworld",
  VanillaAlliance = "vanilla_alliance",
}

export type Operator = {
  id: string;
  icaoCode: string;
  iataCode: string;
  shortName: string;
  fullName: string;
  callsign: string;
  hubs: string[];
  fleetSize: number;
  fleetTypes: string[];
  avgFleetAge: number;
  logoUrl: string | null;
  backgroundUrl: string | null;
  type: OperatorType;
  continent: Continent;
  alliance?: Alliance | null;
};
