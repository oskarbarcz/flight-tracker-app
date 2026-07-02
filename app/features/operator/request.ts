import type { Operator, Rotation } from "~/models";

export type CreateOperatorRequest = Omit<Operator, "id" | "fleetTypes" | "fleetSize">;
export type EditOperatorRequest = CreateOperatorRequest;

export type CreateAircraftRequest = {
  type: string;
  registration: string;
  selcal: string;
  livery: string;
};
export type EditAircraftRequest = CreateAircraftRequest;

export type CreateRepositionRequest = {
  destinationAirportId: string;
};

export type CreateRotationRequest = Pick<Rotation, "name" | "pilotId">;
export type EditRotationRequest = CreateRotationRequest;
export type GetRotationResponse = Omit<Rotation, "pilotId">;
