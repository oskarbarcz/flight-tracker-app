import { Button } from "flowbite-react";
import React from "react";
import { HiCloudDownload, HiPencil } from "react-icons/hi";
import { Link, useLocation } from "react-router";
import type { Airport } from "~/features/airport";
import { AirportQualityIcon } from "~/features/airport/components/Airport/AirportQualityIcon";
import { airportEditPath, airportEnrichPath } from "~/features/airport/components/Management/airportSections";
import { getUtcOffset } from "~/shared/lib/formatGeo";

type Props = {
  airport: Airport;
  readOnly?: boolean;
};

export function AirportHeadline({ airport, readOnly }: Props) {
  const utcOffset = getUtcOffset(airport.timezone);
  const { pathname } = useLocation();

  return (
    <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
            {airport.name}
          </h1>
          <AirportQualityIcon quality={airport.dataQuality} />
        </div>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{airport.icaoCode}</span>
          <span aria-hidden>·</span>
          <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{airport.iataCode}</span>
          <span aria-hidden>·</span>
          <span>
            {airport.city.name}, {airport.country.name}
          </span>
          {utcOffset ? (
            <>
              <span aria-hidden>·</span>
              <span className="font-mono">{utcOffset}</span>
            </>
          ) : null}
        </div>
      </div>

      {!readOnly && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button as={Link} to={airportEnrichPath(pathname)} color="light" size="sm" className="space-x-1.5">
            <HiCloudDownload />
            <span>Enrich data</span>
          </Button>
          <Button as={Link} to={airportEditPath(pathname)} color="indigo" size="sm" className="space-x-1.5">
            <HiPencil />
            <span>Update airport data</span>
          </Button>
        </div>
      )}
    </header>
  );
}
