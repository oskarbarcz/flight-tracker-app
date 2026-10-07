import type { RefObject } from "react";
import { useOutletContext } from "react-router";
import type { QueueView } from "~/features/change-request/lib/changeRequestQueue";
import type { ChangeRequest, ChangeRequestDetail } from "~/features/change-request/model";

export type DataChangeReviewContext = {
  requests: ChangeRequest[];
  isQueueLoading: boolean;
  hasQueueFailed: boolean;
  view: QueueView;
  hrefFor: (requestId: string) => string;
  queueHref: string;
  recordDecision: (decided: ChangeRequestDetail) => void;
  refreshQueue: () => Promise<void>;
  decidedRequestId: RefObject<string | null>;
};

export function useDataChangeReview(): DataChangeReviewContext {
  return useOutletContext<DataChangeReviewContext>();
}
