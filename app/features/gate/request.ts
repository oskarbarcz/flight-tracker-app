import type { Gate } from "~/features/gate";

export type CreateGateRequest = Omit<Gate, "id" | "airportId">;
export type EditGateRequest = CreateGateRequest;
export type GetGateResponse = Gate;
