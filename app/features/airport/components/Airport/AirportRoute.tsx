import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";

type RouteAirport = {
  id: string;
  iataCode: string;
};

type Props = {
  departure: RouteAirport;
  destination: RouteAirport;
  className?: string;
};

export function AirportRoute({ departure, destination, className }: Props) {
  return (
    <div
      className={twMerge(
        "flex items-center gap-2 font-mono text-lg font-bold text-gray-900 dark:text-white",
        className,
      )}
    >
      <AirportCodeLink airport={departure} />
      <FaArrowRight size={12} className="shrink-0 text-gray-500" />
      <AirportCodeLink airport={destination} />
    </div>
  );
}

function AirportCodeLink({ airport }: { airport: RouteAirport }) {
  return (
    <Link to={`/airports-library/${airport.id}`} viewTransition className="transition-colors hover:text-primary-500">
      {airport.iataCode}
    </Link>
  );
}
