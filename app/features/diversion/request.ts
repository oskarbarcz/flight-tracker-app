import type { ApiCoordinates } from "~/features/emergency/request";
import type { Airport, DiversionReason, DiversionSeverity } from "~/models";

export type ApiDiversionResponse = {
  id: string;
  severity: DiversionSeverity;
  reason: DiversionReason;
  freeText: string;
  position: ApiCoordinates;
  notifySecurityOnGround: boolean;
  notifyMedicalOnGround: boolean;
  notifyFirefightersOnGround: boolean;
  airport: Airport;
  decisionTime: string;
  estimatedTimeAtDestination: string;
};

export type ReportDiversionRequest = {
  severity: DiversionSeverity;
  reason: DiversionReason;
  freeText: string;
  position: ApiCoordinates;
  notifySecurityOnGround: boolean;
  notifyMedicalOnGround: boolean;
  notifyFirefightersOnGround: boolean;
  airportId: string;
  estimatedTimeAtDestination: string;
};

export type UpdateDiversionRequest = Partial<ReportDiversionRequest>;
