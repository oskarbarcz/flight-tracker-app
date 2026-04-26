import React from "react";
import { AirportHeaderActions } from "~/components/airport/Header/AirportHeaderActions";
import { formatCoordinates, getUtcOffset } from "~/functions/formatGeo";
import { toHuman } from "~/i18n/translate";
import type { Airport } from "~/models";

type Props = {
  airport: Airport;
};

export function AirportHeader({ airport }: Props) {
  const utcOffset = getUtcOffset(airport.timezone);
  const coordinates = formatCoordinates(airport.location.latitude, airport.location.longitude);
  const region = toHuman.airport.continent(airport.continent);

  return (
    <header className="flex flex-col md:flex-row md:items-start gap-4">
      <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 min-w-28 self-start">
        <div className="text-3xl font-bold tracking-wider text-gray-900 dark:text-gray-100 leading-none font-mono">
          {airport.iataCode}
        </div>
        <div className="text-xs text-gray-500 mt-1.5 font-mono tracking-wide">{airport.icaoCode}</div>
      </div>

      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">{airport.name}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {airport.city}, {airport.country}
        </p>
        <dl className="text-sm space-y-1">
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-gray-500">Region · Timezone:</dt>
            <dd className="text-gray-800 dark:text-gray-200">
              {region} · {airport.timezone}
              {utcOffset && ` · ${utcOffset}`}
            </dd>
          </div>
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-gray-500">Coordinates:</dt>
            <dd className="text-gray-800 dark:text-gray-200 font-mono">{coordinates}</dd>
          </div>
        </dl>
      </div>

      <AirportHeaderActions airport={airport} />
    </header>
  );
}
