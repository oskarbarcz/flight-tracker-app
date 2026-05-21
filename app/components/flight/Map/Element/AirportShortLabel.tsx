"use client";

import { HiOutlineGlobeAlt } from "react-icons/hi";
import type { Airport } from "~/models";

type Props = {
  airport: Airport;
};

export function AirportShortLabel({ airport }: Props) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-2 py-1 text-xs shadow-sm whitespace-nowrap">
      <HiOutlineGlobeAlt className="text-sky-500 shrink-0" size={14} />
      <span className="leading-none text-gray-700">{airport.name}</span>
      <span className="leading-none font-mono font-bold text-gray-900">{airport.iataCode}</span>
    </span>
  );
}
