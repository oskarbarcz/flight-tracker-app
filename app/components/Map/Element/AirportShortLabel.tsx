"use client";

import { Airport } from "~/models";

type Props = {
  airport: Airport;
};

export default function AirportShortLabel({ airport }: Props) {
  return (
    <span className="text-white font-bold whitespace-nowrap text-xs rounded-2xl py-1 px-2 bg-indigo-500">
      {airport.iataCode}
    </span>
  );
}
