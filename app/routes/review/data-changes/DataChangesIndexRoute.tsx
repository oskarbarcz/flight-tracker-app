import React, { useEffect } from "react";
import { LuCircleCheck, LuInbox, LuTriangleAlert } from "react-icons/lu";
import { useNavigate } from "react-router";
import { ChangeRequestReviewSkeleton } from "~/features/change-request/components/Review/ChangeRequestReviewSkeleton";
import { useDataChangeReview } from "~/features/change-request/components/Review/dataChangeReviewContext";
import { QueueTab, requestsInView } from "~/features/change-request/lib/changeRequestQueue";
import { PanelEmptyState } from "~/shared/ui/Display/PanelEmptyState";

const SPLIT_VIEW_QUERY = "(min-width: 48rem)";

export default function DataChangesIndexRoute() {
  const { requests, isQueueLoading, hasQueueFailed, view, hrefFor } = useDataChangeReview();
  const navigate = useNavigate();
  const first = requestsInView(requests, view)[0] ?? null;

  useEffect(() => {
    if (!isQueueLoading && first !== null && window.matchMedia(SPLIT_VIEW_QUERY).matches) {
      navigate(hrefFor(first.id), { replace: true });
    }
  }, [isQueueLoading, first, hrefFor, navigate]);

  if (isQueueLoading || first !== null) {
    return <ChangeRequestReviewSkeleton />;
  }

  if (hasQueueFailed) {
    return (
      <PanelEmptyState
        icon={LuTriangleAlert}
        title="Queue unavailable"
        body="The review queue could not be loaded, so there is nothing to show yet. Try again from the list."
      />
    );
  }

  if (view.kind !== null) {
    return (
      <PanelEmptyState icon={LuInbox} title="Nothing to show" body="Clear the kind filter to see every proposal." />
    );
  }

  if (view.tab === QueueTab.Decided) {
    return (
      <PanelEmptyState
        icon={LuInbox}
        title="No decisions yet"
        body="Proposals you accept or reject stay on record here."
      />
    );
  }

  return (
    <PanelEmptyState
      icon={LuCircleCheck}
      title="All caught up"
      body="Every proposal has been decided. Past decisions stay on record under Decided."
    />
  );
}
