import React from "react";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import type { Airport } from "~/models";

type Props = {
  airport: Airport;
};

export function AirportPreviewPanel({ airport }: Props) {
  return (
    <div className="rounded-lg border border-sky-200 bg-sky-50/60 dark:border-sky-900 dark:bg-sky-950/40">
      <div className="flex items-center gap-2 px-3 py-2">
        <HiOutlineGlobeAlt className="text-sky-500" size={14} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-sky-500">Airport</span>
        <span className="truncate text-xs text-gray-600 dark:text-gray-300">{airport.name}</span>
        <span className="ms-auto font-mono text-xl font-bold text-gray-900 dark:text-white">{airport.iataCode}</span>
      </div>
    </div>
  );
}
