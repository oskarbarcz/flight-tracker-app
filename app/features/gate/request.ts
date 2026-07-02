import type { Gate } from "~/models";

export type CreateGateRequest = Omit<Gate, "id" | "airportId">;
export type EditGateRequest = CreateGateRequest;
export type GetGateResponse = Gate;
