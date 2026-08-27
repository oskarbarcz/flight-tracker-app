import React from "react";
import { FaTowerObservation } from "react-icons/fa6";
import { AirportShape } from "~/features/airport/components/Airport/AirportShape";
import type { Airport } from "~/features/airport/model";
import { formatDayDate } from "~/features/stats/lib/heatmap";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { OptionAvatarFrame } from "~/shared/ui/Form/AdvancedSelect/OptionAvatarFrame";

type Props = {
  icaoCode: string;
  airport: Airport | undefined;
  firstVisitAt: string;
};

export function AirportVisitCard({ icaoCode, airport, firstVisitAt }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <OptionAvatarFrame>
        {airport?.shape ? (
          <AirportShape shape={airport.shape} />
        ) : (
          <FaTowerObservation className="text-gray-400 dark:text-gray-500" size={14} aria-hidden={true} />
        )}
      </OptionAvatarFrame>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="shrink-0 font-mono text-lg font-bold text-gray-900 dark:text-white">
            {airport?.iataCode ?? icaoCode}
          </span>
          {airport && (
            <>
              <span className="shrink-0 text-gray-300 dark:text-gray-600">|</span>
              <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">{airport.name}</span>
            </>
          )}
        </div>
        <div className="truncate text-sm text-gray-500 dark:text-gray-400">
          {airport ? `${airport.city.name}, ${airport.country.name}` : "Airport details unavailable"}
        </div>
      </div>

      <span className="shrink-0 text-end">
        <FieldLabel>First visit</FieldLabel>
        <span className="mt-0.5 block whitespace-nowrap font-mono text-xs tabular-nums text-gray-700 dark:text-gray-200">
          {formatDayDate(new Date(firstVisitAt))}
        </span>
      </span>
    </div>
  );
}
