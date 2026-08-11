import type { Continent } from "~/features/airport/model";

export enum OperatorType {
  Legacy = "legacy",
  LowCost = "low_cost",
  Charter = "charter",
  GovernmentMilitary = "government_military",
}

export enum OperatorServiceType {
  Passenger = "passenger",
  Cargo = "cargo",
  Both = "both",
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
  serviceType: OperatorServiceType;
  continent: Continent;
  alliance?: Alliance | null;
};
