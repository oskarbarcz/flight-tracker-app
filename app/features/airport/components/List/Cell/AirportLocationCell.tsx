import React from "react";
import type { Airport } from "~/features/airport";
import { AirportQualityIcon } from "~/features/airport/components/Airport/AirportQualityIcon";
import { dateToTimezoneTime } from "~/shared/ui/Date/FormattedTimezoneTime";
import { CountryFlag } from "~/shared/ui/Display/CountryFlag";

type Props = {
  airport: Airport;
};

export function AirportLocationCell({ airport }: Props) {
  return (
    <span className="block min-w-0 px-1 py-2.5 sm:px-3">
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="truncate text-sm font-bold text-gray-900 sm:text-base dark:text-white">{airport.name}</span>
        <AirportQualityIcon quality={airport.dataQuality} />
      </span>
      <span className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
        <CountryFlag code={airport.country.code} name={airport.country.name} />
        <span className="truncate">
          {airport.city.name}, {airport.country.name}
        </span>
        <span aria-hidden className="shrink-0">
          ·
        </span>
        <span className="shrink-0 font-mono tabular-nums">{dateToTimezoneTime(new Date(), airport.timezone)}</span>
      </span>
    </span>
  );
}
