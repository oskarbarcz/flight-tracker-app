import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiPencil } from "react-icons/hi";
import { LuClock, LuMapPin, LuTag } from "react-icons/lu";
import { Link } from "react-router";
import type { Airport } from "~/features/airport";
import { formatLatitude, formatLongitude, getUtcOffset } from "~/shared/lib/formatGeo";
import { dateToTimezoneTime } from "~/shared/ui/Date/FormattedTimezoneTime";
import { DataField } from "~/shared/ui/Display/DataField";
import { DataSection } from "~/shared/ui/Display/DataSection";

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
