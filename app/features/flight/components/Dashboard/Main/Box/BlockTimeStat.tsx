import React from "react";
import { DelayBadge } from "~/features/flight/components/Dashboard/Main/Box/DelayBadge";
import { type BlockEvent, blockEventLabel } from "~/features/flight/lib/blockEvents";
import { isSameUtcDay } from "~/shared/lib/date";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { StatBlock } from "~/shared/ui/Display/StatBlock";

type Props = {
  event: BlockEvent;
};

export function BlockTimeStat({ event }: Props) {
  const isToday = isSameUtcDay(event.time, new Date());

  return (
    <div className="flex shrink-0 flex-col items-end gap-1.5">
      <StatBlock
        label={blockEventLabel(event)}
        align="right"
        value={<FormattedIcaoTime date={event.time} />}
        meta={isToday ? undefined : <FormattedIcaoDate date={event.time} />}
      />
      <DelayBadge minutes={event.delayMinutes} />
    </div>
  );
}
