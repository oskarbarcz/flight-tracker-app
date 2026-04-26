import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { HiPencil } from "react-icons/hi";
import { LuClock, LuMapPin, LuTag } from "react-icons/lu";
import { Link } from "react-router";
import { dateToTimezoneTime } from "~/components/shared/Date/FormattedTimezoneTime";
import { formatLatitude, formatLongitude, getUtcOffset } from "~/functions/formatGeo";
import type { Airport } from "~/models";

type Props = {
  airport: Airport;
};

export function AirportDetailsCard({ airport }: Props) {
  const utcOffset = getUtcOffset(airport.timezone);
  const timeZoneLabel = utcOffset ? `${airport.timezone} (${utcOffset})` : airport.timezone;

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  const currentTime = dateToTimezoneTime(now, airport.timezone);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Geography & Identity</h2>
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
      </div>

      <div className="space-y-5">
        <DataSection icon={LuTag} color="indigo" title="Identity">
          <div className="grid grid-cols-2 gap-2">
            <DataField label="IATA code" value={airport.iataCode} mono />
            <DataField label="ICAO code" value={airport.icaoCode} mono />
          </div>
        </DataSection>

        <DataSection icon={LuMapPin} color="green" title="Location">
          <div className="grid grid-cols-2 gap-2">
            <DataField label="Country" value={airport.country} />
            <DataField label="City" value={airport.city} />
            <DataField label="Latitude" value={formatLatitude(airport.location.latitude)} mono />
            <DataField label="Longitude" value={formatLongitude(airport.location.longitude)} mono />
            <div className="col-span-2">
              <DataField label="Elevation" value="—" mono />
            </div>
          </div>
        </DataSection>

        <DataSection icon={LuClock} color="orange" title="Time">
          <div className="grid grid-cols-2 gap-2">
            <DataField label="Time Zone" value={timeZoneLabel} mono />
            <DataField label="Current Time" value={currentTime} mono />
          </div>
        </DataSection>
      </div>
    </div>
  );
}

const colorMap = {
  indigo: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950",
  green: "text-green-500 bg-green-100 dark:bg-green-950",
  orange: "text-orange-500 bg-orange-100 dark:bg-orange-950",
  blue: "text-blue-500 bg-blue-50 dark:bg-blue-950",
};

type DataSectionProps = {
  icon: IconType;
  color: keyof typeof colorMap;
  title: string;
  children: React.ReactNode;
};

function DataSection({ icon: Icon, color, title, children }: DataSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <div className={`size-6 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="size-3" />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">{title}</h3>
      </div>
      {children}
    </section>
  );
}

type DataFieldProps = {
  label: string;
  value: string;
  mono?: boolean;
};

function DataField({ label, value, mono = false }: DataFieldProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2">
      <div className="text-[10px] uppercase text-gray-500 tracking-wider font-medium">{label}</div>
      <div className={`text-sm font-bold text-gray-900 dark:text-gray-100 ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}
