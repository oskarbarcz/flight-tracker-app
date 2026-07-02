import type { Coordinates } from "~/features/runway/model";
import type { Airport } from "~/models";

export type CreateAirportRequest = Omit<Airport, "id" | "shape"> & {
  shape?: Coordinates[] | null;
};
export type EditAirportRequest = CreateAirportRequest;
export type GetAirportResponse = Airport;
