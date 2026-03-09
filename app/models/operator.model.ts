import type { Continent } from "~/models/airport.model";

export enum OperatorType {
  Legacy = "legacy",
  LowCost = "low_cost",
  Charter = "charter",
  GovernmentMilitary = "government_military",
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
};
