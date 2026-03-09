import type { Aircraft, Operator, Rotation } from "~/models";

export type CreateOperatorRequest = Omit<Operator, "id" | "fleetTypes" | "fleetSize">;
export type EditOperatorRequest = CreateOperatorRequest;

export type CreateAircraftRequest = Omit<Aircraft, "id">;
export type EditAircraftRequest = CreateAircraftRequest;

export type CreateRotationRequest = Pick<Rotation, "name" | "pilotId">;
export type EditRotationRequest = CreateRotationRequest;
export type GetRotationResponse = Omit<Rotation, "pilotId">;
