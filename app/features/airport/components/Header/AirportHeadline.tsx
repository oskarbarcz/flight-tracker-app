import { Button } from "flowbite-react";
import React from "react";
import { HiPencil } from "react-icons/hi";
import { Link } from "react-router";
import type { Airport } from "~/features/airport";
import { getUtcOffset } from "~/shared/lib/formatGeo";

type Props = {
  airport: Airport;
};

export function AirportHeadline({ airport }: Props) {
  const utcOffset = getUtcOffset(airport.timezone);

  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">{airport.name}</h1>
        <span className="hidden h-5 w-px shrink-0 self-center bg-gray-300 sm:block dark:bg-gray-700" />
        <span className="flex flex-wrap items-baseline gap-x-1.5 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{airport.icaoCode}</span>
          <span aria-hidden>·</span>
          <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{airport.iataCode}</span>
          <span aria-hidden>·</span>
          <span>
            {airport.city}, {airport.country}
          </span>
          {utcOffset ? (
            <>
              <span aria-hidden>·</span>
              <span className="font-mono">{utcOffset}</span>
            </>
          ) : null}
        </span>
      </div>

      <Button
        as={Link}
        to={`/airports/${airport.id}/edit`}
        viewTransition
        color="indigo"
        size="sm"
        className="shrink-0 space-x-1.5"
      >
        <HiPencil />
        <span>Update airport data</span>
      </Button>
    </header>
  );
}
