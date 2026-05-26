import { type Diversion, DiversionReason, DiversionSeverity } from "~/models/diversion.model";
import type { ReportDiversionRequest, UpdateDiversionRequest } from "~/state/api/request/diversion.request";
import type { ApiCoordinates } from "~/state/api/request/emergency.request";

export type ReportDiversionFormData = {
  severity: DiversionSeverity;
  reason: DiversionReason;
  freeText: string;
  airportId: string;
  notifySecurityOnGround: boolean;
  notifyMedicalOnGround: boolean;
  notifyFirefightersOnGround: boolean;
  estimatedTimeAtDestination: Date | null;
};

export const diversionSeverityOptions = [
  { label: "Advisory", value: DiversionSeverity.Advisory },
  { label: "Caution", value: DiversionSeverity.Caution },
  { label: "Warning", value: DiversionSeverity.Warning },
  { label: "Emergency", value: DiversionSeverity.Emergency },
];

export const diversionReasonOptions = [
  { label: "Emergency", value: DiversionReason.Emergency },
  { label: "Air traffic control", value: DiversionReason.AirTrafficControl },
  { label: "Fuel", value: DiversionReason.Fuel },
  { label: "Communications", value: DiversionReason.Communications },
  { label: "Medical", value: DiversionReason.Medical },
  { label: "Weather", value: DiversionReason.Weather },
  { label: "Technical", value: DiversionReason.Technical },
  { label: "Security", value: DiversionReason.Security },
  { label: "Other", value: DiversionReason.Other },
];

export function initReportDiversionData(): ReportDiversionFormData {
  return {
    severity: DiversionSeverity.Caution,
    reason: DiversionReason.Weather,
    freeText: "",
    airportId: "",
    notifySecurityOnGround: false,
    notifyMedicalOnGround: false,
    notifyFirefightersOnGround: false,
    estimatedTimeAtDestination: null,
  };
}

export function reportFormDataToRequest(
  values: ReportDiversionFormData,
  position: ApiCoordinates,
): ReportDiversionRequest {
  if (values.estimatedTimeAtDestination === null) {
    throw new Error("Estimated time at destination is required");
  }
  return {
    severity: values.severity,
    reason: values.reason,
    freeText: values.freeText.trim(),
    airportId: values.airportId,
    position,
    notifySecurityOnGround: values.notifySecurityOnGround,
    notifyMedicalOnGround: values.notifyMedicalOnGround,
    notifyFirefightersOnGround: values.notifyFirefightersOnGround,
    estimatedTimeAtDestination: values.estimatedTimeAtDestination.toISOString(),
  };
}

export function updateDiversionFormDataToRequest(
  values: ReportDiversionFormData,
  position: ApiCoordinates,
): UpdateDiversionRequest {
  return reportFormDataToRequest(values, position);
}

export function diversionToFormData(diversion: Diversion): ReportDiversionFormData {
  return {
    severity: diversion.severity,
    reason: diversion.reason,
    freeText: diversion.freeText,
    airportId: diversion.airport.id,
    notifySecurityOnGround: diversion.notifySecurityOnGround,
    notifyMedicalOnGround: diversion.notifyMedicalOnGround,
    notifyFirefightersOnGround: diversion.notifyFirefightersOnGround,
    estimatedTimeAtDestination: diversion.estimatedTimeAtDestination,
  };
}
