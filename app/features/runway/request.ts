import type { Runway } from "~/models";

export type CreateRunwayRequest = Omit<Runway, "id" | "airportId">;
export type EditRunwayRequest = CreateRunwayRequest;
export type GetRunwayResponse = Runway;
