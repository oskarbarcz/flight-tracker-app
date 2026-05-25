import type { Gate } from "~/models";
import type { Coordinates } from "~/models/runway.model";

export type CreateGateRequest = Omit<Gate, "id" | "airportId" | "coordinates"> & {
  coordinates?: Coordinates | null;
};
export type EditGateRequest = CreateGateRequest;
export type GetGateResponse = Gate;
