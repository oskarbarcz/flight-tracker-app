import React from "react";
import { Container } from "~/components/shared/Layout/Container";
import { toHuman } from "~/i18n/translate";
import type { Airport } from "~/models";

type Props = {
  airport: Airport;
};

export function AirportDetailsCard({ airport }: Props) {
  return (
    <Container>
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Details</h2>
      <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 text-sm">
        <DetailRow label="Name" value={airport.name} />
        <DetailRow label="IATA" value={airport.iataCode} />
        <DetailRow label="ICAO" value={airport.icaoCode} />
        <DetailRow label="City" value={airport.city} />
        <DetailRow label="Country" value={airport.country} />
        <DetailRow label="Region" value={toHuman.airport.continent(airport.continent)} />
        <DetailRow label="Timezone" value={airport.timezone} />
      </dl>
    </Container>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-gray-500 uppercase tracking-wide font-medium">{label}</dt>
      <dd className="text-gray-800 dark:text-gray-200">{value}</dd>
    </>
  );
}
