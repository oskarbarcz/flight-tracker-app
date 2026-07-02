import type { Gate } from "~/features/gate";
import type { Coordinates } from "~/shared/models/coordinates";

export type CreateGateRequest = Omit<Gate, "id" | "airportId" | "coordinates"> & {
  coordinates?: Coordinates | null;
};
export type EditGateRequest = CreateGateRequest;
export type GetGateResponse = Gate;
