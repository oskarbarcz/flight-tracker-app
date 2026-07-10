import React from "react";
import type { Airport } from "~/features/airport";

type Props = {
  airport: Airport;
};

export function AirportHeader({ airport }: Props) {
  return (
    <header>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{airport.name}</h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {airport.city}, {airport.country}
      </p>
    </header>
  );
}
