import type { Aircraft, Operator, Rotation } from "~/models";

export type CreateOperatorDto = Omit<Operator, "id" | "fleetTypes" | "fleetSize">;
export type EditOperatorDto = CreateOperatorDto;

export type CreateAircraftRequest = Omit<Aircraft, "id">;
export type EditAircraftRequest = CreateAircraftRequest;

export type CreateRotationRequest = Pick<Rotation, "name" | "pilotId">;
export type EditRotationRequest = CreateRotationRequest;
export type RotationResponse = Omit<Rotation, "pilotId">;
