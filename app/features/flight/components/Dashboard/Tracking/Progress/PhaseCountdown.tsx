import React from "react";
import { twMerge } from "tailwind-merge";
import { useCountdown } from "~/features/flight/components/Dashboard/Tracking/Progress/useCountdown";
import { TimeCertaintyMark } from "~/features/flight/components/Dashboard/Tracking/TimeCertaintyMark";
import type { TimeProvenance } from "~/features/flight/lib/blockEvents";
import { formatTimeInterval } from "~/shared/lib/time";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

function ReferenceTime({ provenance, time }: { provenance: TimeProvenance; time: Date }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap text-xs tabular-nums text-gray-500 dark:text-gray-400">
      {provenance !== "actual" && <TimeCertaintyMark certainty={provenance} />}
      <span className="text-gray-700 dark:text-gray-200">
        <FormattedIcaoTime date={time} />
      </span>
    </span>
  );
}

type Props = {
  event: string;
  target: { time: Date; provenance: TimeProvenance; scheduled: Date };
};

export function PhaseCountdown({ event, target }: Props) {
  const secondsLeft = useCountdown(target.time);
  const overdue = secondsLeft < 0;
  const showsScheduled = target.provenance !== "scheduled" && target.time.getTime() !== target.scheduled.getTime();

  return (
    <div>
      <FieldLabel>{overdue ? `${event} overdue` : `Time to ${event.toLowerCase()}`}</FieldLabel>
      <span
        className={twMerge(
          "mt-1 block font-mono text-3xl font-bold leading-none tabular-nums",
          overdue ? "text-amber-700 dark:text-amber-400" : "text-gray-900 dark:text-gray-100",
        )}
      >
        {formatTimeInterval(Math.abs(secondsLeft))}
      </span>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
        <ReferenceTime provenance={target.provenance} time={target.time} />
        {showsScheduled && <ReferenceTime provenance="scheduled" time={target.scheduled} />}
      </div>
    </div>
  );
}
