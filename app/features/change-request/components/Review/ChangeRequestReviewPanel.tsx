import { Button } from "flowbite-react";
import React, { useEffect } from "react";
import { LuChevronLeft, LuSearchX } from "react-icons/lu";
import { Link } from "react-router";
import { useAuth } from "~/app-state/useAuth";
import { ChangeRequestDecisionBar } from "~/features/change-request/components/Review/ChangeRequestDecisionBar";
import { ChangeRequestFieldList } from "~/features/change-request/components/Review/ChangeRequestFieldList";
import {
  CHANGE_REQUEST_HEADING_ID,
  ChangeRequestHeadline,
} from "~/features/change-request/components/Review/ChangeRequestHeadline";
import { CompetingRequestsNote, TargetGoneNote } from "~/features/change-request/components/Review/ChangeRequestNotes";
import { ChangeRequestOutcome } from "~/features/change-request/components/Review/ChangeRequestOutcome";
import { ChangeRequestReviewSkeleton } from "~/features/change-request/components/Review/ChangeRequestReviewSkeleton";
import { useDataChangeReview } from "~/features/change-request/components/Review/dataChangeReviewContext";
import { useChangeRequestReview } from "~/features/change-request/hooks/useChangeRequestReview";
import { competingRequests } from "~/features/change-request/lib/changeRequestQueue";
import { type ChangeRequestDetail, ChangeRequestStatus } from "~/features/change-request/model";
import { UserRole } from "~/features/user";
import { toHuman } from "~/i18n/translate";
import { PanelEmptyState } from "~/shared/ui/Display/PanelEmptyState";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

const SECTION_TITLE: Record<ChangeRequestStatus, string> = {
  [ChangeRequestStatus.Pending]: "Proposed changes",
  [ChangeRequestStatus.Accepted]: "Applied changes",
  [ChangeRequestStatus.Rejected]: "Rejected changes",
  [ChangeRequestStatus.Withdrawn]: "Withdrawn changes",
};

type Props = {
  requestId: string;
};

function BackToQueue({ to }: { to: string }) {
  return (
    <Link
      to={to}
      viewTransition
      className="inline-flex items-center gap-1 self-start text-sm text-gray-500 hover:text-indigo-600 md:hidden dark:text-gray-400 dark:hover:text-indigo-400"
    >
      <LuChevronLeft size={16} aria-hidden={true} />
      Review queue
    </Link>
  );
}

function ReviewFailure({ onRetry }: { onRetry: () => void }) {
  return (
    <Container>
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <p className="text-sm text-gray-700 dark:text-gray-300">This proposal could not be loaded.</p>
        <Button color="alternative" size="xs" onClick={onRetry}>
          Try again
        </Button>
      </div>
    </Container>
  );
}

export function ChangeRequestReviewPanel({ requestId }: Props) {
  const { user } = useAuth();
  const { requests, hrefFor, queueHref, recordDecision, refreshQueue, decidedRequestId } = useDataChangeReview();
  const { state, reload, showDetail } = useChangeRequestReview(requestId);

  useEffect(() => {
    const decidedId = decidedRequestId.current;
    if (state.status === "ready" && decidedId !== null && state.detail.id !== decidedId) {
      decidedRequestId.current = null;
      document.getElementById(CHANGE_REQUEST_HEADING_ID)?.focus();
    }
  }, [state, decidedRequestId]);

  if (state.status === "loading") {
    return <ChangeRequestReviewSkeleton />;
  }

  if (state.status === "missing") {
    return (
      <div className="flex flex-col gap-4">
        <BackToQueue to={queueHref} />
        <PanelEmptyState
          icon={LuSearchX}
          title="Proposal not found"
          body="No proposal has this id. Pick one from the queue instead."
        />
      </div>
    );
  }

  if (state.status === "failed") {
    return (
      <div className="flex flex-col gap-4">
        <BackToQueue to={queueHref} />
        <ReviewFailure onRetry={reload} />
      </div>
    );
  }

  const { detail, airport } = state;
  const competing = detail.isPending ? competingRequests(requests, detail) : [];

  const handleDecided = (decided: ChangeRequestDetail) => {
    showDetail(decided);
    recordDecision(decided);
  };

  const handleStale = () => {
    reload();
    refreshQueue();
  };

  return (
    <article className="flex flex-col gap-4">
      <BackToQueue to={queueHref} />
      <ChangeRequestHeadline detail={detail} airport={airport} canOpenAirports={user?.role === UserRole.Operations} />
      {detail.isPending && detail.isTargetGone && (
        <TargetGoneNote noun={toHuman.changeRequest.resource(detail.resource)} />
      )}
      <CompetingRequestsNote competing={competing} hrefFor={hrefFor} />
      <Container padding="none" header={<CardHeader title={SECTION_TITLE[detail.status]} />}>
        <ChangeRequestFieldList detail={detail} />
      </Container>
      {detail.isPending ? (
        <ChangeRequestDecisionBar key={detail.id} detail={detail} onDecided={handleDecided} onStale={handleStale} />
      ) : (
        <ChangeRequestOutcome detail={detail} />
      )}
    </article>
  );
}
