import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";
import type { Flight } from "~/features/flight";
import type { FlightListLinks } from "~/features/flight/components/List/FlightListLinks";

type Props = {
  flight: Flight;
  links: FlightListLinks;
};

export function FlightListRouteCell({ flight, links }: Props) {
  const { departureAirport, destinationAirport } = flight;

  return (
    <span className="block min-w-0 px-1 py-2.5 sm:px-3">
      <span className="flex items-center gap-1.5 font-mono text-sm font-bold text-gray-900 sm:text-base dark:text-white">
        <Link
          to={links.airport(departureAirport.id)}
          viewTransition
          className="relative z-10 transition-colors hover:text-primary-500 pointer-coarse:pointer-events-none"
        >
          {departureAirport.iataCode}
        </Link>
        <FaArrowRight size={11} className="shrink-0 text-gray-400 dark:text-gray-500" />
        <Link
          to={links.airport(destinationAirport.id)}
          viewTransition
          className="relative z-10 transition-colors hover:text-primary-500 pointer-coarse:pointer-events-none"
        >
          {destinationAirport.iataCode}
        </Link>
      </span>
      <span className="mt-0.5 hidden truncate text-xs text-gray-500 sm:block dark:text-gray-400">
        {departureAirport.name} → {destinationAirport.name}
      </span>
    </span>
  );
}
