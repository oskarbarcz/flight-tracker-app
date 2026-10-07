import React from "react";
import { useParams } from "react-router";
import { ChangeRequestReviewPanel } from "~/features/change-request/components/Review/ChangeRequestReviewPanel";

export default function DataChangeReviewRoute() {
  const { requestId } = useParams();

  if (requestId === undefined) {
    return null;
  }

  return <ChangeRequestReviewPanel requestId={requestId} />;
}
