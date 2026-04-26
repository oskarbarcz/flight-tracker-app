import { NoiseSensitivity } from "~/models";
import type { CreateGateFormData } from "~/models/form/gate.form";
import type { CreateGateRequest, GetGateResponse } from "~/state/api/request/gate.request";

function nullable(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function gateFormDataToRequest(input: CreateGateFormData): CreateGateRequest {
  const noiseActive = input.noiseSensitivity === NoiseSensitivity.Yes;
  return {
    terminalId: input.terminalId,
    name: input.name.trim(),
    bridge: input.bridge,
    stairs: input.stairs,
    deicing: input.deicing,
    deicingDescription: nullable(input.deicingDescription),
    gpu: input.gpu,
    pca: input.pca,
    parkingPositionType: input.parkingPositionType,
    parkingSpotType: input.parkingSpotType,
    parkingAssistance: input.parkingAssistance,
    location: input.location,
    noiseSensitivity: input.noiseSensitivity,
    noiseSensitivityText: noiseActive ? nullable(input.noiseSensitivityText) : null,
    noiseSensitivityStartTime: noiseActive ? nullable(input.noiseSensitivityStartTime) : null,
    noiseSensitivityEndTime: noiseActive ? nullable(input.noiseSensitivityEndTime) : null,
    fuelingOptions: input.fuelingOptions,
  };
}

export function gateToFormData(input: GetGateResponse): CreateGateFormData {
  return {
    terminalId: input.terminalId,
    name: input.name,
    bridge: input.bridge,
    stairs: input.stairs,
    deicing: input.deicing,
    deicingDescription: input.deicingDescription ?? "",
    gpu: input.gpu,
    pca: input.pca,
    parkingPositionType: input.parkingPositionType,
    parkingSpotType: input.parkingSpotType,
    parkingAssistance: input.parkingAssistance,
    location: input.location,
    noiseSensitivity: input.noiseSensitivity,
    noiseSensitivityText: input.noiseSensitivityText ?? "",
    noiseSensitivityStartTime: input.noiseSensitivityStartTime ?? "",
    noiseSensitivityEndTime: input.noiseSensitivityEndTime ?? "",
    fuelingOptions: input.fuelingOptions,
  };
}
