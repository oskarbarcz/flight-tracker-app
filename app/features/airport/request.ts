import type { Airport } from "~/features/airport";
import type { Coordinates } from "~/shared/models/coordinates";

export type CreateAirportRequest = Omit<Airport, "id" | "shape" | "country"> & {
  country: string;
  shape?: Coordinates[] | null;
};
export type EditAirportRequest = CreateAirportRequest;
export type GetAirportResponse = Airport;
