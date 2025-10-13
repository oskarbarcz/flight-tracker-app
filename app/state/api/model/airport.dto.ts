import { Airport } from "~/models";

export type CreateAirportRequest = Omit<Airport, "id">;
export type EditAirportRequest = CreateAirportRequest;
export type GetAirportResponse = Airport;
