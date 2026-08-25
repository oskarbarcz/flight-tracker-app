import React from "react";
import { Link } from "react-router";
import type { Flight } from "~/features/flight";
import type { FlightListLinks } from "~/features/flight/components/List/FlightListLinks";
import { OperatorFin } from "~/features/operator/components/OperatorFin";

type Props = {
  flight: Flight;
  links: FlightListLinks;
};

export function FlightListFlightCell({ flight, links }: Props) {
  const operatorHref = links.operator(flight);
  const fin = <OperatorFin operator={flight.operator} />;

  return (
    <span className="flex min-w-0 items-center gap-2.5 px-1 py-2.5 sm:px-3">
      {operatorHref === null ? (
        <span className="hidden size-9 shrink-0 items-center justify-center sm:flex">{fin}</span>
      ) : (
        <Link
          to={operatorHref}
          viewTransition
          aria-label={flight.operator.shortName}
          className="relative z-10 hidden size-9 shrink-0 items-center justify-center transition-opacity hover:opacity-70 sm:flex"
        >
          {fin}
        </Link>
      )}
      <span className="min-w-0">
        <span className="block truncate font-mono text-sm font-bold text-gray-900 sm:text-base dark:text-white">
          {flight.callsign}
        </span>
        <Link
          to={links.aircraft(flight)}
          viewTransition
          className="relative z-10 block truncate font-mono text-xs text-gray-500 transition-colors hover:text-primary-500 dark:text-gray-400"
        >
          {flight.aircraft.registration}
        </Link>
      </span>
    </span>
  );
}
