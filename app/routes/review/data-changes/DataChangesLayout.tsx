import React, { useCallback, useMemo, useRef } from "react";
import { Outlet, useNavigate, useParams, useSearchParams } from "react-router";
import { ChangeRequestQueue } from "~/features/change-request/components/Queue/ChangeRequestQueue";
import type { DataChangeReviewContext } from "~/features/change-request/components/Review/dataChangeReviewContext";
import { useChangeRequestQueue } from "~/features/change-request/hooks/useChangeRequestQueue";
import { useRefreshPendingChangeRequests } from "~/features/change-request/hooks/usePendingChangeRequests";
import {
  nextRequestAfter,
  QueueTab,
  type QueueView,
  requestsInView,
} from "~/features/change-request/lib/changeRequestQueue";
import {
  CHANGE_REQUEST_RESOURCES,
  type ChangeRequestDetail,
  type ChangeRequestResource,
} from "~/features/change-request/model";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";

const BASE_PATH = "/data-changes";
const STATUS_PARAM = "status";
const KIND_PARAM = "kind";

function parseView(params: URLSearchParams): QueueView {
  const kind = params.get(KIND_PARAM);
  return {
    tab: params.get(STATUS_PARAM) === QueueTab.Decided ? QueueTab.Decided : QueueTab.Pending,
    kind: CHANGE_REQUEST_RESOURCES.find((resource) => resource === kind) ?? null,
  };
}

function withSearch(path: string, params: URLSearchParams): string {
  return params.size > 0 ? `${path}?${params.toString()}` : path;
}

export default function DataChangesLayout() {
  usePageTitle("Data change reviews");

  const { requests, isLoading, hasFailed, reload, replace } = useChangeRequestQueue();
  const { requestId = null } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const refreshPendingCount = useRefreshPendingChangeRequests();
  const shownRequestId = useRef(requestId);
  shownRequestId.current = requestId;
  const decidedRequestId = useRef<string | null>(null);
  const search = searchParams.toString();
  const view = useMemo(() => parseView(new URLSearchParams(search)), [search]);

  const hrefFor = useCallback((id: string) => withSearch(`${BASE_PATH}/${id}`, new URLSearchParams(search)), [search]);
  const queueHref = withSearch(BASE_PATH, new URLSearchParams(search));

  const tabHref = (tab: QueueTab) => {
    const params = new URLSearchParams(search);
    if (tab === QueueTab.Pending) {
      params.delete(STATUS_PARAM);
    } else {
      params.set(STATUS_PARAM, tab);
    }
    return withSearch(BASE_PATH, params);
  };

  const selectKind = (kind: ChangeRequestResource | null) => {
    const params = new URLSearchParams(search);
    if (kind === null) {
      params.delete(KIND_PARAM);
    } else {
      params.set(KIND_PARAM, kind);
    }
    navigate(withSearch(BASE_PATH, params), { viewTransition: true });
  };

  const recordDecision = (decided: ChangeRequestDetail) => {
    const pending = requestsInView(requests, { tab: QueueTab.Pending, kind: view.kind });
    const next = nextRequestAfter(pending, decided.id);
    replace(decided);
    if (shownRequestId.current !== decided.id) {
      refreshPendingCount();
      return;
    }
    decidedRequestId.current = decided.id;
    navigate(next ? hrefFor(next.id) : queueHref);
  };

  const refreshQueue = () => {
    refreshPendingCount();
    return reload();
  };

  const context: DataChangeReviewContext = {
    requests,
    isQueueLoading: isLoading,
    hasQueueFailed: hasFailed,
    view,
    hrefFor,
    queueHref,
    recordDecision,
    refreshQueue,
    decidedRequestId,
  };

  const isReviewing = requestId !== null;

  return (
    <>
      <div className={isReviewing ? "hidden lg:block" : undefined}>
        <SectionHeader title="Data change reviews" />
      </div>
      <div className="grid gap-4 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <div className={isReviewing ? "hidden lg:block" : undefined}>
          <ChangeRequestQueue
            requests={requests}
            view={view}
            isLoading={isLoading}
            hasFailed={hasFailed}
            selectedId={requestId}
            tabHref={tabHref}
            rowHref={hrefFor}
            onSelectKind={selectKind}
            onRetry={reload}
          />
        </div>
        <div className={isReviewing ? "min-w-0" : "hidden min-w-0 lg:block"}>
          <Outlet context={context} />
        </div>
      </div>
    </>
  );
}
