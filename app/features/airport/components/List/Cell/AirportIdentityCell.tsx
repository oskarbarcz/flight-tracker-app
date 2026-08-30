import React from "react";
import type { Airport } from "~/features/airport";
import { AirportShapeFrame } from "~/features/airport/components/Airport/AirportShapeFrame";

type Props = {
  airport: Airport;
};

export function AirportIdentityCell({ airport }: Props) {
  return (
    <span className="flex min-w-0 items-center gap-2.5 px-1 py-2.5 sm:px-3">
      <AirportShapeFrame shape={airport.shape} />
      <span className="min-w-0">
        <span className="block truncate font-mono text-sm font-bold text-gray-900 sm:text-base dark:text-white">
          {airport.iataCode}
        </span>
        <span className="block truncate font-mono text-xs text-gray-500 dark:text-gray-400">{airport.icaoCode}</span>
      </span>
    </span>
  );
}
