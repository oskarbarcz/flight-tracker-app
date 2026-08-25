import { Badge } from "flowbite-react";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { HiChevronRight } from "react-icons/hi";
import { Link } from "react-router";
import type { FlightHistoryAirport } from "~/features/aircraft";
import type { FlightStatus } from "~/features/flight";
import { FlightStatusBadge } from "~/features/flight/components/Flight/FlightStatusBadge";
import { dateToIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { dateToIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";

export const AIRCRAFT_HISTORY_GRID =
  "grid grid-cols-[94px_74px_1fr_18px] sm:grid-cols-[112px_88px_minmax(140px,1fr)_192px_34px]";

type Props = {
  date: Date | null;
  identifier: string;
  departure: FlightHistoryAirport;
  arrival: FlightHistoryAirport;
  status: FlightStatus | null;
  flightId?: string;
};

function AirportCode({ airport }: { airport: FlightHistoryAirport }) {
  return (
    <Link
      to={`/airports/${airport.id}`}
      viewTransition
      className="relative z-10 transition-colors hover:text-primary-500"
    >
      {airport.iataCode}
    </Link>
  );
}

export function AircraftHistoryRow({ date, identifier, departure, arrival, status, flightId }: Props) {
  const label = `${identifier}, ${departure.iataCode} to ${arrival.iataCode}`;

  return (
    <div
      className={`${AIRCRAFT_HISTORY_GRID} relative items-center bg-white transition-colors dark:bg-gray-900 ${flightId ? "hover:bg-gray-50 dark:hover:bg-gray-800/60" : ""}`}
    >
      {flightId && (
        <Link to={`/flights/${flightId}/overview`} viewTransition aria-label={label} className="absolute inset-0 z-0" />
      )}

      <span className="block min-w-0 px-1 py-2.5 sm:px-3">
        <span className="block text-sm font-bold tabular-nums text-gray-900 sm:text-base dark:text-white">
          {date ? dateToIcaoDate(date) : "—"}
        </span>
        <span className="mt-0.5 block font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
          {date ? `${dateToIcaoTime(date)}Z` : ""}
        </span>
      </span>

      <span className="block min-w-0 px-1 py-2.5 sm:px-3">
        <span className="block truncate font-mono text-sm font-bold text-gray-900 sm:text-base dark:text-white">
          {identifier}
        </span>
      </span>

      <span className="block min-w-0 px-1 py-2.5 sm:px-3">
        <span className="flex items-center gap-1.5 font-mono text-sm font-bold text-gray-900 sm:text-base dark:text-white">
          <AirportCode airport={departure} />
          <FaArrowRight size={11} className="shrink-0 text-gray-400 dark:text-gray-500" />
          <AirportCode airport={arrival} />
        </span>
        <span className="mt-0.5 hidden truncate text-xs text-gray-500 sm:block dark:text-gray-400">
          {departure.name} → {arrival.name}
        </span>
      </span>

      <HiChevronRight
        className={`order-4 size-4 shrink-0 sm:order-5 ${flightId ? "text-gray-400 dark:text-gray-500" : "invisible"}`}
        aria-hidden
      />

      <span className="order-5 col-span-4 px-1 pb-2.5 sm:order-4 sm:col-span-1 sm:px-3 sm:pt-2.5 sm:pb-2.5">
        {status === null ? (
          <Badge color="gray" size="xs">
            Reposition
          </Badge>
        ) : (
          <FlightStatusBadge status={status} />
        )}
      </span>
    </div>
  );
}
