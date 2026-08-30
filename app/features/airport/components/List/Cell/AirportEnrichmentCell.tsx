import React from "react";
import { HiCloudDownload } from "react-icons/hi";
import type { Airport } from "~/features/airport";

type Props = {
  airport: Airport;
  onEnrich: (airport: Airport) => void;
};

export function AirportEnrichmentCell({ airport, onEnrich }: Props) {
  return (
    <span className="flex min-w-0 items-center px-1 pt-0 pb-2.5 sm:px-3 sm:pt-2.5">
      <button
        type="button"
        onClick={() => onEnrich(airport)}
        aria-label={`Enrich ${airport.iataCode}`}
        className="relative z-10 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <HiCloudDownload className="size-3.5" aria-hidden />
        Enrich
      </button>
    </span>
  );
}
