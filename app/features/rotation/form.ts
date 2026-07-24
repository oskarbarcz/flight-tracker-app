import type { RotationLeg } from "~/features/rotation/model";
import type { AddLegRequest, UpdateLegRequest } from "~/features/rotation/request";

export type LegFormData = {
  flightNumber: string;
  departureId: string;
  arrivalId: string;
  offBlockTime: Date;
  onBlockTime: Date;
};

export function initLegFormData(departureId = ""): LegFormData {
  const base = new Date();
  base.setSeconds(0, 0);
  return {
    flightNumber: "",
    departureId,
    arrivalId: "",
    offBlockTime: base,
    onBlockTime: base,
  };
}

export function legToFormData(leg: RotationLeg): LegFormData {
  return {
    flightNumber: leg.flightNumber,
    departureId: leg.departure.id,
    arrivalId: leg.arrival.id,
    offBlockTime: leg.offBlockTime,
    onBlockTime: leg.onBlockTime,
  };
}

export function legFormDataToAddRequest(data: LegFormData): AddLegRequest {
  return {
    flightNumber: data.flightNumber.trim(),
    departureId: data.departureId,
    arrivalId: data.arrivalId,
    offBlockTime: data.offBlockTime.toISOString(),
    onBlockTime: data.onBlockTime.toISOString(),
  };
}

export function legFormDataToUpdateRequest(data: LegFormData): UpdateLegRequest {
  return legFormDataToAddRequest(data);
}
