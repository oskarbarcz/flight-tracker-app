import type { Airport } from "~/models";
import type { Coordinates } from "~/models/runway.model";

export type CreateAirportRequest = Omit<Airport, "id" | "shape"> & {
  shape?: Coordinates[] | null;
};
export type EditAirportRequest = CreateAirportRequest;
export type GetAirportResponse = Airport;
