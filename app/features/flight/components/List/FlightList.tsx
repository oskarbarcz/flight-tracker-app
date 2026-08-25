import { Pagination, Spinner } from "flowbite-react";
import React from "react";
import type { Flight } from "~/features/flight";
import type { FlightListTrailingColumn } from "~/features/flight/components/List/FlightListColumns";
import { FlightListHeader } from "~/features/flight/components/List/FlightListHeader";
import type { FlightListLinks } from "~/features/flight/components/List/FlightListLinks";
import { FlightListRow } from "~/features/flight/components/List/FlightListRow";

type Props = {
  flights: Flight[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  links: FlightListLinks;
  trailingColumn: FlightListTrailingColumn;
};

export function FlightList({ flights, loading, page, totalPages, onPageChange, links, trailingColumn }: Props) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px] dark:bg-gray-900/50">
          <Spinner color="indigo" size="xl" />
        </div>
      )}

      <FlightListHeader trailingColumn={trailingColumn} />

      <ul>
        {flights.map((flight) => (
          <li key={flight.id} className="border-b border-gray-200 last:border-b-0 dark:border-gray-800">
            <FlightListRow flight={flight} links={links} trailingColumn={trailingColumn} />
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex justify-center overflow-x-auto bg-gray-50 pt-2 pb-4 dark:bg-gray-800">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} showIcons />
        </div>
      )}
    </div>
  );
}
