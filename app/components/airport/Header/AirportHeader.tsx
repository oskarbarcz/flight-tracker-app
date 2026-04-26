import React from "react";
import { BadgeValueDisplay } from "~/components/shared/Display/BadgeValueDisplay";
import { toHuman } from "~/i18n/translate";
import type { Airport } from "~/models";

type Props = {
  airport: Airport;
};

export function AirportHeader({ airport }: Props) {
  return (
    <header className="flex flex-col md:flex-row md:items-end gap-3 mb-3">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">{airport.name}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          {airport.city}, {airport.country}
        </p>
        <div className="flex flex-wrap gap-1.5 items-center">
          <BadgeValueDisplay name="IATA" value={airport.iataCode} />
          <BadgeValueDisplay name="ICAO" value={airport.icaoCode} />
          <BadgeValueDisplay name="TZ" value={airport.timezone} />
          <BadgeValueDisplay name="REGION" value={toHuman.airport.continent(airport.continent)} />
        </div>
      </div>
    </header>
  );
}
