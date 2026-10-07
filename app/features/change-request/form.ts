import type { RejectChangeRequestRequest } from "~/features/change-request/request";

export type RejectChangeRequestFormData = {
  rejectionReason: string;
};

export function initRejectChangeRequestData(): RejectChangeRequestFormData {
  return {
    rejectionReason: "",
  };
}

export function rejectChangeRequestFormDataToRequest(values: RejectChangeRequestFormData): RejectChangeRequestRequest {
  return {
    rejectionReason: values.rejectionReason.trim(),
  };
}
