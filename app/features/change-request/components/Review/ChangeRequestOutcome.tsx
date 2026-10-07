import React from "react";
import { ChangeRequestStatusBadge } from "~/features/change-request/components/ChangeRequestStatusBadge";
import { type ChangeRequestDetail, ChangeRequestStatus } from "~/features/change-request/model";
import { UserName } from "~/features/user/components/UserName";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  detail: ChangeRequestDetail;
};

const VERB: Record<ChangeRequestStatus, string> = {
  [ChangeRequestStatus.Pending]: "Proposed",
  [ChangeRequestStatus.Accepted]: "Applied",
  [ChangeRequestStatus.Rejected]: "Rejected",
  [ChangeRequestStatus.Withdrawn]: "Withdrawn",
};

function DecidedAt({ date }: { date: Date | null }) {
  if (date === null) {
    return null;
  }
  return (
    <>
      {" "}
      on <FormattedIcaoDate date={date} /> <FormattedIcaoTime date={date} />
    </>
  );
}

export function ChangeRequestOutcome({ detail }: Props) {
  const decider = detail.status === ChangeRequestStatus.Withdrawn ? detail.requestedBy : detail.decidedBy;

  return (
    <Container>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <ChangeRequestStatusBadge status={detail.status} />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {VERB[detail.status]}
            {decider && (
              <>
                {" "}
                by <UserName user={decider} />
              </>
            )}
            <DecidedAt date={detail.decidedAt} />
          </p>
        </div>
        {detail.status === ChangeRequestStatus.Rejected && detail.rejectionReason && (
          <blockquote className="rounded-lg bg-gray-50 px-3 py-2 text-sm whitespace-pre-line text-gray-800 dark:bg-gray-800 dark:text-gray-100">
            {detail.rejectionReason}
          </blockquote>
        )}
      </div>
    </Container>
  );
}
