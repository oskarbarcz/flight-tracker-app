import React from "react";
import { ABSENT, formatAltitude } from "~/features/route/lib/routeFigures";
import type { FlightTiming } from "~/features/route/lib/routeTiming";
import { formatClockDuration, formatCompactDuration } from "~/shared/lib/time";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { StatBlock } from "~/shared/ui/Display/StatBlock";

type Props = {
  timing: FlightTiming;
  cruiseLevelsFeet: number[];
  departureRunway: string | null;
};

function minutesOf(seconds: number): number {
  return seconds / 60;
}

function cruiseSpan(levelsFeet: number[]): string | undefined {
  const lowest = levelsFeet.at(0);
  const highest = levelsFeet.at(-1);

  if (lowest === undefined || highest === undefined || lowest === highest) {
    return undefined;
  }

  return `${formatAltitude(lowest)} → ${formatAltitude(highest)}`;
}

export function RouteTiming({ timing, cruiseLevelsFeet, departureRunway }: Props) {
  const { topOfClimb, topOfDescent, cruiseSeconds } = timing;

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
      <StatBlock
        label="Takeoff"
        value={<FormattedIcaoTime date={timing.takeoff} />}
        meta={departureRunway === null ? undefined : `RW${departureRunway}`}
      />
      <StatBlock
        label="Top of climb"
        value={topOfClimb === null ? ABSENT : <FormattedIcaoTime date={topOfClimb.at} />}
        meta={
          topOfClimb === null
            ? undefined
            : `${formatCompactDuration(minutesOf(topOfClimb.offsetSeconds))} after takeoff`
        }
      />
      <StatBlock
        label="Cruise time"
        value={cruiseSeconds === null ? ABSENT : formatClockDuration(minutesOf(cruiseSeconds))}
        meta={cruiseSpan(cruiseLevelsFeet)}
      />
      <StatBlock
        label="Top of descent"
        value={topOfDescent === null ? ABSENT : <FormattedIcaoTime date={topOfDescent.at} />}
        meta={
          topOfDescent === null
            ? undefined
            : `${formatCompactDuration(minutesOf(topOfDescent.offsetSeconds))} before landing`
        }
      />
    </div>
  );
}
