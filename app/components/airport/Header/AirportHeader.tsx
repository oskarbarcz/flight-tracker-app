import React from "react";
import { getUtcOffset } from "~/functions/formatGeo";
import { toHuman } from "~/i18n/translate";
import type { Airport } from "~/models";

type Props = {
  airport: Airport;
};

export function AirportHeader({ airport }: Props) {
  const utcOffset = getUtcOffset(airport.timezone);
  const region = toHuman.airport.continent(airport.continent);
  const timezone = utcOffset ? `${airport.timezone} ${utcOffset}` : airport.timezone;

  return (
    <header className="flex flex-col md:flex-row md:items-start gap-x-6 gap-y-3">
      <div className="md:basis-1/2 md:flex-1">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{airport.name}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {airport.city}, {airport.country}
        </p>
      </div>

      <dl className="text-sm space-y-1 md:basis-1/2 md:flex-1">
        <Row label="Region:" value={region} />
        <Row label="Timezone:" value={timezone} mono />
      </dl>
    </header>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-wrap gap-x-2">
      <dt className="text-gray-500">{label}</dt>
      <dd className={`text-gray-800 dark:text-gray-200 ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}
