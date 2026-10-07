import { Badge } from "flowbite-react";
import React from "react";
import { ChangeRequestStatus } from "~/features/change-request/model";
import { toHuman } from "~/i18n/translate";

const STATUS_TONE = {
  [ChangeRequestStatus.Pending]: "warning",
  [ChangeRequestStatus.Accepted]: "success",
  [ChangeRequestStatus.Rejected]: "failure",
  [ChangeRequestStatus.Withdrawn]: "gray",
} as const;

type Props = {
  status: ChangeRequestStatus;
};

export function ChangeRequestStatusBadge({ status }: Props) {
  return (
    <Badge color={STATUS_TONE[status]} size="xs">
      {toHuman.changeRequest.status(status)}
    </Badge>
  );
}
