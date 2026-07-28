import React from "react";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import { FlightStatus } from "~/features/flight";
import type { RotationLeg } from "~/features/rotation";

type Props = {
  leg: RotationLeg;
  className?: string;
};

function flightPath(leg: RotationLeg): string | null {
  if (!leg.flight) {
    return null;
  }
  return leg.flight.status === FlightStatus.Closed ? `/flight-history/${leg.flight.id}` : `/track/${leg.flight.id}`;
}

export function LegFlightNumber({ leg, className }: Props) {
  const path = flightPath(leg);

  if (!path) {
    return (
      <span className={twMerge("font-mono font-bold text-gray-500 dark:text-gray-400", className)}>
        {leg.flightNumber}
      </span>
    );
  }

  return (
    <Link
      to={path}
      viewTransition
      className={twMerge(
        "rounded font-mono font-bold text-gray-900 transition-colors hover:text-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:text-white dark:hover:text-indigo-400",
        className,
      )}
    >
      {leg.flightNumber}
    </Link>
  );
}
