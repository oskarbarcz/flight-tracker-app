import React from "react";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";

type Props = {
  at: string;
};

export function NotocIssuedAt({ at }: Props) {
  const date = new Date(at);

  return (
    <span>
      <FormattedIcaoDate date={date} /> <FormattedIcaoTime date={date} />
    </span>
  );
}
