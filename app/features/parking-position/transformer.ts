import { NoiseSensitivity } from "~/features/parking-position";
import type { CreateParkingPositionFormData } from "~/features/parking-position/form";
import type { CreateParkingPositionRequest, GetParkingPositionResponse } from "~/features/parking-position/request";

function nullable(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function parkingPositionFormDataToRequest(input: CreateParkingPositionFormData): CreateParkingPositionRequest {
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
    type: input.type,
    spotType: input.spotType,
    assistance: input.assistance,
    location: input.location,
    noiseSensitivity: input.noiseSensitivity,
    noiseSensitivityText: noiseActive ? nullable(input.noiseSensitivityText) : null,
    noiseSensitivityStartTime: noiseActive ? nullable(input.noiseSensitivityStartTime) : null,
    noiseSensitivityEndTime: noiseActive ? nullable(input.noiseSensitivityEndTime) : null,
    fuelingOptions: input.fuelingOptions,
    coordinates: input.coordinates,
  };
}

export function parkingPositionToFormData(input: GetParkingPositionResponse): CreateParkingPositionFormData {
  return {
    terminalId: input.terminalId,
    name: input.name,
    bridge: input.bridge,
    stairs: input.stairs,
    deicing: input.deicing,
    deicingDescription: input.deicingDescription ?? "",
    gpu: input.gpu,
    pca: input.pca,
    type: input.type,
    spotType: input.spotType,
    assistance: input.assistance,
    location: input.location,
    noiseSensitivity: input.noiseSensitivity,
    noiseSensitivityText: input.noiseSensitivityText ?? "",
    noiseSensitivityStartTime: input.noiseSensitivityStartTime ?? "",
    noiseSensitivityEndTime: input.noiseSensitivityEndTime ?? "",
    fuelingOptions: input.fuelingOptions,
    coordinates: input.coordinates ?? null,
  };
}
