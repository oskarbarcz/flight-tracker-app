"use client";

import { Airport } from "~/models";

type Props = {
  airport: Airport;
};

export default function AirportShortLabel({ airport }: Props) {
  return (
    <span className="text-white font-bold text-xs rounded-xl font-mono py-1 px-2 bg-indigo-500">
      {airport.iataCode}
    </span>
  );
}
