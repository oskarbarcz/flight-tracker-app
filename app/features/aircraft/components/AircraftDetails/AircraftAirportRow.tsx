import React from "react";
import type { Airport } from "~/features/airport";
import { AirportShape } from "~/features/airport/components/Airport/AirportShape";
import { OptionAvatarFrame } from "~/shared/ui/Form/AdvancedSelect/OptionAvatarFrame";

type Props = {
  airport: Airport;
};

export function AircraftAirportRow({ airport }: Props) {
  return (
    <div className="flex items-center gap-3">
      <OptionAvatarFrame>
        <AirportShape shape={airport.shape} />
      </OptionAvatarFrame>
      <div className="min-w-0">
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="shrink-0 font-mono text-lg font-bold text-gray-900 dark:text-white">{airport.iataCode}</span>
          <span className="shrink-0 text-gray-300 dark:text-gray-600">|</span>
          <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">{airport.name}</span>
        </div>
        <div className="truncate text-sm text-gray-500 dark:text-gray-400">
          {airport.city}, {airport.country}
        </div>
      </div>
    </div>
  );
}
