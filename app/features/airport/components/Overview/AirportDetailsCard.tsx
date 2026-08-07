import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiPencil } from "react-icons/hi";
import { Link } from "react-router";
import type { Airport } from "~/features/airport";
import { formatCoordinates, getUtcOffset } from "~/shared/lib/formatGeo";
import { dateToTimezoneTime } from "~/shared/ui/Date/FormattedTimezoneTime";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";

type Props = {
  airport: Airport;
  readOnly?: boolean;
};

export function AirportDetailsCard({ airport, readOnly }: Props) {
  const utcOffset = getUtcOffset(airport.timezone);
  const timeZoneLabel = utcOffset ? `${airport.timezone} (${utcOffset})` : airport.timezone;

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  const currentTime = dateToTimezoneTime(now, airport.timezone);

  return (
    <TransparentContainer padding="none" className="@container shadow-none">
      <header className="flex items-start justify-between gap-4 border-b border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-stretch gap-5">
          <IdentityCode label="IATA" value={airport.iataCode} />
          <div className="w-px self-stretch bg-gray-200 dark:bg-gray-800" />
          <IdentityCode label="ICAO" value={airport.icaoCode} />
        </div>
        {!readOnly ? (
          <Button
            as={Link}
            to={`/airports/${airport.id}/edit`}
            viewTransition
            size="sm"
            color="indigo"
            className="space-x-1.5"
          >
            <HiPencil />
            <span>Edit</span>
          </Button>
        ) : null}
      </header>

      <dl className="grid grid-cols-2 gap-x-8 gap-y-4 px-5 py-5 @2xl:grid-cols-3 @4xl:grid-cols-5">
        <Field label="Country" value={airport.country} />
        <Field label="City" value={airport.city} />
        <Field
          label="Coordinates"
          value={formatCoordinates(airport.location.latitude, airport.location.longitude)}
          mono
        />
        <Field label="Time zone" value={timeZoneLabel} mono />
        <Field label="Current time" value={currentTime} mono />
      </dl>
    </TransparentContainer>
  );
}

function IdentityCode({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col justify-center">
      <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-mono text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );
}

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className={`mt-0.5 text-sm font-semibold text-gray-900 dark:text-gray-100 ${mono ? "font-mono" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
