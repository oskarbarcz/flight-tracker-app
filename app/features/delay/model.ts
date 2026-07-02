import type { ApiDelayParticipant, ApiDelayReportResponse, ApiDelayRequestResponse } from "~/features/delay/request";

export enum DelayReasonCode {
  AtcStartup = "AMZ",
  EnrouteSlot = "ATZ",
  DepartureRunwayChange = "AMC",
  LoadingError = "RLL",
  LatePushbackCrew = "RLP",
  LateStepsRemoval = "RLS",
  LateServicingEquipment = "RLV",
  SystemReset = "ESR",
  NewDefect = "END",
  SimulatorRestart = "ESM",
  TugBroken = "GBT",
  JetwayBroken = "GBJ",
  StairsBroken = "GBS",
  IncorrectDepartureTime = "ODI",
  NewRouteAtc = "ORA",
  NewRouteOps = "ORO",
  Fuelling = "OFL",
  InboundDelay = "OAD",
  SelfManeuveringStand = "OSM",
  Other = "OTH",
}

export enum DelayReportStatus {
  Pending = "pending",
  Accepted = "accepted",
  Rejected = "rejected",
}

export type DelayParticipant = ApiDelayParticipant;

export class DelayReport {
  id: string;
  delayMinutes: number;
  reasonCode: DelayReasonCode;
  freeText: string | null;
  status: DelayReportStatus;
  reportedBy: DelayParticipant;
  decidedBy: DelayParticipant | null;
  rejectionReason: string | null;
  decidedAt: Date | null;
  createdAt: Date;

  constructor(data: ApiDelayReportResponse) {
    this.id = data.id;
    this.delayMinutes = data.delayMinutes;
    this.reasonCode = data.reasonCode;
    this.freeText = data.freeText;
    this.status = data.status;
    this.reportedBy = data.reportedBy;
    this.decidedBy = data.decidedBy;
    this.rejectionReason = data.rejectionReason;
    this.decidedAt = data.decidedAt ? new Date(data.decidedAt) : null;
    this.createdAt = new Date(data.createdAt);
  }

  get isPending(): boolean {
    return this.status === DelayReportStatus.Pending;
  }

  get isAccepted(): boolean {
    return this.status === DelayReportStatus.Accepted;
  }

  get isRejected(): boolean {
    return this.status === DelayReportStatus.Rejected;
  }
}

export class DelayRequest {
  id: string;
  flightId: string;
  totalDelayMinutes: number;
  isReconciled: boolean;
  isSettled: boolean;
  reports: DelayReport[];
  createdAt: Date;

  constructor(data: ApiDelayRequestResponse) {
    this.id = data.id;
    this.flightId = data.flightId;
    this.totalDelayMinutes = data.totalDelayMinutes;
    this.isReconciled = data.isReconciled;
    this.isSettled = data.isSettled;
    this.reports = data.reports.map((report) => new DelayReport(report));
    this.createdAt = new Date(data.createdAt);
  }

  get allocatedMinutes(): number {
    return this.reports
      .filter((report) => report.isAccepted || report.isPending)
      .reduce((sum, report) => sum + report.delayMinutes, 0);
  }

  get unallocatedMinutes(): number {
    return Math.max(0, this.totalDelayMinutes - this.allocatedMinutes);
  }

  get pendingReports(): DelayReport[] {
    return this.reports.filter((report) => report.isPending);
  }

  get hasPendingReports(): boolean {
    return this.reports.some((report) => report.isPending);
  }
}
