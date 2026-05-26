import type { Airport, DiversionReason, DiversionSeverity } from "~/models";
import type { ApiCoordinates } from "~/state/api/request/emergency.request";

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
