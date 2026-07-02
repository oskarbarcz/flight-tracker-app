import type { Runway } from "~/features/runway";

export type CreateRunwayRequest = Omit<Runway, "id" | "airportId">;
export type EditRunwayRequest = CreateRunwayRequest;
export type GetRunwayResponse = Runway;
