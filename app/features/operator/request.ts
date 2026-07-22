import type { Operator } from "~/features/operator";

export type CreateOperatorRequest = Omit<Operator, "id" | "fleetTypes" | "fleetSize">;
export type EditOperatorRequest = CreateOperatorRequest;

export type CreateAircraftRequest = {
  type: string;
  registration: string;
  selcal: string | null;
  livery?: string;
  baseAirportId: string | null;
  etopsThresholdMinutes: number | null;
};
export type EditAircraftRequest = CreateAircraftRequest;

export type CreateRepositionRequest = {
  destinationAirportId: string;
};
