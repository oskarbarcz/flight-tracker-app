import React from "react";
import type { Flight } from "~/features/flight";
import { listOffBlockTimeOf } from "~/features/flight/lib/flightListTimes";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";

type Props = {
  flight: Flight;
};

export function FlightListDateCell({ flight }: Props) {
  const offBlockTime = listOffBlockTimeOf(flight);

  return (
    <span className="block min-w-0 px-1 py-2.5 sm:px-3">
      <span className="block text-sm font-bold tabular-nums sm:text-base text-gray-900 dark:text-white">
        <FormattedIcaoDate date={offBlockTime} />
      </span>
      <span className="mt-0.5 block text-xs tabular-nums text-gray-500 dark:text-gray-400">
        <FormattedIcaoTime date={offBlockTime} />
      </span>
    </span>
  );
}
