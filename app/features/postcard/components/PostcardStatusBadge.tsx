import { Badge } from "flowbite-react";
import React from "react";
import { PostcardStatus } from "~/features/postcard/model";
import { toHuman } from "~/i18n/translate";

const TONE: Record<PostcardStatus, string> = {
  [PostcardStatus.Ready]: "success",
  [PostcardStatus.Pending]: "info",
  [PostcardStatus.Failed]: "failure",
};

type Props = {
  status: PostcardStatus;
};

export function PostcardStatusBadge({ status }: Props) {
  return (
    <Badge size="xs" color={TONE[status]}>
      {toHuman.postcard.status(status)}
    </Badge>
  );
}
