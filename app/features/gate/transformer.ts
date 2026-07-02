import type { CreateGateFormData } from "~/features/gate/form";
import type { CreateGateRequest, GetGateResponse } from "~/features/gate/request";

export function gateFormDataToRequest(input: CreateGateFormData): CreateGateRequest {
  return {
    terminalId: input.terminalId,
    name: input.name.trim(),
    category: input.category,
    parkingPositionId: input.parkingPositionId === "" ? null : input.parkingPositionId,
  };
}

export function gateToFormData(input: GetGateResponse): CreateGateFormData {
  return {
    terminalId: input.terminalId,
    name: input.name,
    category: input.category,
    parkingPositionId: input.parkingPositionId ?? "",
  };
}
