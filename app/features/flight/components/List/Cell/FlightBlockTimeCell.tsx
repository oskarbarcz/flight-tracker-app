import React from "react";
import type { Flight } from "~/features/flight";
import { actualScheduleOf, airMinutesOf, blockMinutesOf } from "~/features/flight/lib/flightListTimes";
import { formatClockDuration } from "~/shared/lib/time";

type Props = {
  flight: Flight;
};

export function blockTimeLabelOf(flight: Flight): string {
  const actual = actualScheduleOf(flight);
  if (actual === null) return "block time unavailable";

  return `block ${formatClockDuration(blockMinutesOf(actual))}, air ${formatClockDuration(airMinutesOf(actual))}`;
}

export function FlightBlockTimeCell({ flight }: Props) {
  const actual = actualScheduleOf(flight);

  if (actual === null) {
    return <span className="block px-1.5 py-2.5 text-sm text-gray-400 sm:px-3 dark:text-gray-500">—</span>;
  }

  return (
    <span className="block min-w-0 px-1 py-2.5 sm:px-3">
      <span className="block font-mono text-sm font-bold tabular-nums text-gray-900 dark:text-white">
        {formatClockDuration(blockMinutesOf(actual))}
      </span>
      <span className="mt-0.5 block font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
        air {formatClockDuration(airMinutesOf(actual))}
      </span>
    </span>
  );
}
