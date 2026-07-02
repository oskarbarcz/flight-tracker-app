import type { DelayReasonCode, DelayReportStatus } from "~/features/delay/model";

export type ApiDelayParticipant = {
  id: string;
  name: string;
};

export type ApiDelayReportResponse = {
  id: string;
  delayMinutes: number;
  reasonCode: DelayReasonCode;
  freeText: string | null;
  status: DelayReportStatus;
  reportedBy: ApiDelayParticipant;
  decidedBy: ApiDelayParticipant | null;
  rejectionReason: string | null;
  decidedAt: string | null;
  createdAt: string;
};

export type ApiDelayRequestResponse = {
  id: string;
  flightId: string;
  totalDelayMinutes: number;
  allocatedMinutes: number;
  isReconciled: boolean;
  isSettled: boolean;
  reports: ApiDelayReportResponse[];
  createdAt: string;
};

export type ReportDelayRequest = {
  delayMinutes: number;
  reasonCode: DelayReasonCode;
  freeText?: string;
};

export type RejectDelayReportRequest = {
  rejectionReason: string;
};

export type DelayRequestStatusFilter = "pending" | "settled";
