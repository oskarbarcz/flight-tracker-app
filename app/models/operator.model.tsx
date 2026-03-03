import { Continent } from "~/models/airport.model";

export type Operator = {
  id: string;
  icaoCode: string;
  iataCode: string;
  shortName: string;
  fullName: string;
  callsign: string;
  hubs: string[];
  fleetSize: number;
  avgFleetAge: number;
  logoUrl: string | null;
  continent: Continent;
};

export type CreateOperatorDto = Omit<Operator, "id">;
export type EditOperatorDto = CreateOperatorDto;
