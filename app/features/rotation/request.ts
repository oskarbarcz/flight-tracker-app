import type { RotationStatus } from "~/features/rotation/model";

export type RotationUserResponse = {
  id: string;
  name: string;
};

export type LegAirportResponse = {
  id: string;
  iataCode: string;
  icaoCode: string;
  name: string;
};

export type LegFlightResponse = {
  id: string;
  flightNumber: string;
  status: string;
};

export type RotationLegResponse = {
  id: string;
  flightNumber: string;
  departure: LegAirportResponse;
  arrival: LegAirportResponse;
  offBlockTime: string;
  onBlockTime: string;
  blockTime: number;
  flight: LegFlightResponse | null;
};

export type ApiRotationResponse = {
  id: string;
  name: string;
  operatorId: string;
  pilotId: string;
  status: RotationStatus;
  createdBy: RotationUserResponse;
  updatedBy: RotationUserResponse | null;
  legs: RotationLegResponse[];
  createdAt: string;
  updatedAt: string | null;
};

export type CreateRotationRequest = {
  name: string;
  pilotId: string;
};

export type EditRotationRequest = {
  name?: string;
  pilotId?: string;
};

export type AddLegRequest = {
  flightNumber: string;
  departureId: string;
  arrivalId: string;
  offBlockTime: string;
  onBlockTime: string;
};

export type UpdateLegRequest = Partial<AddLegRequest>;
