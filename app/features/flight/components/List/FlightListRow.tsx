import React from "react";
import { HiChevronRight } from "react-icons/hi";
import { Link } from "react-router";
import type { Flight } from "~/features/flight";
import { FlightListDateCell } from "~/features/flight/components/List/Cell/FlightListDateCell";
import { FlightListFlightCell } from "~/features/flight/components/List/Cell/FlightListFlightCell";
import { FlightListRouteCell } from "~/features/flight/components/List/Cell/FlightListRouteCell";
import type { FlightListTrailingColumn } from "~/features/flight/components/List/FlightListColumns";
import type { FlightListLinks } from "~/features/flight/components/List/FlightListLinks";

type Props = {
  flight: Flight;
  links: FlightListLinks;
  trailingColumn: FlightListTrailingColumn;
};

export function FlightListRow({ flight, links, trailingColumn }: Props) {
  const label = `${flight.flightNumber}, ${flight.departureAirport.iataCode} to ${flight.destinationAirport.iataCode}, ${trailingColumn.label(flight)}`;

  return (
    <div
      className={`${trailingColumn.grid} relative items-center bg-white transition-colors hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/60`}
    >
      <Link to={links.flight(flight)} viewTransition aria-label={label} className="absolute inset-0 z-0" />
      <FlightListDateCell flight={flight} />
      <FlightListFlightCell flight={flight} links={links} />
      <FlightListRouteCell flight={flight} links={links} />
      <HiChevronRight
        className={`${trailingColumn.chevronClassName} size-4 shrink-0 text-gray-400 dark:text-gray-500`}
        aria-hidden
      />
      <span className={trailingColumn.trailingClassName}>{trailingColumn.render(flight)}</span>
    </div>
  );
}
