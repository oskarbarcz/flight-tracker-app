import type { Airport } from "~/models/airport.model";
import type { ApiDiversionResponse } from "~/state/api/request/diversion.request";
import type { ApiCoordinates } from "~/state/api/request/emergency.request";

export enum DiversionSeverity {
  Advisory = "advisory",
  Caution = "caution",
  Warning = "warning",
  Emergency = "emergency",
}

export enum DiversionReason {
  Emergency = "emer",
  AirTrafficControl = "atc",
  Fuel = "fuel",
  Communications = "comm",
  Medical = "med",
  Weather = "wx",
  Technical = "tech",
  Security = "sec",
  Other = "other",
}

export enum DiversionReporterRole {
  Crew = "crew",
  Operations = "operations",
  Dispatcher = "dispatcher",
  AirTrafficControl = "atc",
}

export class Diversion {
  id: string;
  severity: DiversionSeverity;
  reason: DiversionReason;
  freeText: string;
  position: ApiCoordinates;
  notifySecurityOnGround: boolean;
  notifyMedicalOnGround: boolean;
  notifyFirefightersOnGround: boolean;
  airport: Airport;
  decisionTime: Date;
  estimatedTimeAtDestination: Date;

  constructor(data: ApiDiversionResponse) {
    this.id = data.id;
    this.severity = data.severity;
    this.reason = data.reason;
    this.freeText = data.freeText;
    this.position = data.position;
    this.notifySecurityOnGround = data.notifySecurityOnGround;
    this.notifyMedicalOnGround = data.notifyMedicalOnGround;
    this.notifyFirefightersOnGround = data.notifyFirefightersOnGround;
    this.airport = data.airport;
    this.decisionTime = new Date(data.decisionTime);
    this.estimatedTimeAtDestination = new Date(data.estimatedTimeAtDestination);
  }
}
