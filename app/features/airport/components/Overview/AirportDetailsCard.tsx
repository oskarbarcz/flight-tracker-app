import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { HiPencil } from "react-icons/hi";
import { LuClock, LuMapPin } from "react-icons/lu";
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
    <TransparentContainer padding="none" className="shadow-none">
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

      <div className="space-y-6 px-5 py-5">
        <DataGroup icon={LuMapPin} title="Location">
          <Field label="Country" value={airport.country} />
          <Field label="City" value={airport.city} />
          <Field
            label="Coordinates"
            value={formatCoordinates(airport.location.latitude, airport.location.longitude)}
            mono
            wide
          />
        </DataGroup>

        <DataGroup icon={LuClock} title="Local time">
          <Field label="Time zone" value={timeZoneLabel} mono wide />
          <Field label="Current time" value={currentTime} mono />
        </DataGroup>
      </div>
    </TransparentContainer>
  );
}

function IdentityCode({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col justify-center">
      <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-mono text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );
}

function DataGroup({ icon: Icon, title, children }: { icon: IconType; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="size-3.5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{title}</h3>
      </div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4">{children}</dl>
    </section>
  );
}

function Field({
  label,
  value,
  mono = false,
  wide = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "col-span-2" : undefined}>
      <dt className="text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className={`mt-0.5 text-sm font-semibold text-gray-900 dark:text-gray-100 ${mono ? "font-mono" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
