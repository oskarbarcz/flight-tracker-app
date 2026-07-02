import type { Airport } from "~/features/airport";
import type { Coordinates } from "~/features/runway/model";

export type CreateAirportRequest = Omit<Airport, "id" | "shape"> & {
  shape?: Coordinates[] | null;
};
export type EditAirportRequest = CreateAirportRequest;
export type GetAirportResponse = Airport;
