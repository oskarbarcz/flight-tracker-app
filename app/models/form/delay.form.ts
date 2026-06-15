import { DelayReasonCode } from "~/models/delay.model";
import type { RejectDelayReportRequest, ReportDelayRequest } from "~/state/api/request/delay.request";

export type FileDelayReportFormData = {
  reasonCode: DelayReasonCode;
  delayMinutes: number;
  freeText: string;
};

export function initFileDelayReportData(): FileDelayReportFormData {
  return {
    reasonCode: DelayReasonCode.Other,
    delayMinutes: 0,
    freeText: "",
  };
}

export function fileDelayReportFormDataToRequest(values: FileDelayReportFormData): ReportDelayRequest {
  const freeText = values.freeText.trim();
  return {
    reasonCode: values.reasonCode,
    delayMinutes: Number(values.delayMinutes),
    ...(freeText.length > 0 ? { freeText } : {}),
  };
}

export type RejectDelayReportFormData = {
  rejectionReason: string;
};

export function initRejectDelayReportData(): RejectDelayReportFormData {
  return {
    rejectionReason: "",
  };
}

export function rejectDelayReportFormDataToRequest(values: RejectDelayReportFormData): RejectDelayReportRequest {
  return {
    rejectionReason: values.rejectionReason.trim(),
  };
}
