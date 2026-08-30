import React from "react";
import type { Flight } from "~/features/flight";
import type { FlightListTrailingColumn } from "~/features/flight/components/List/FlightListColumns";
import type { FlightListLinks } from "~/features/flight/components/List/FlightListLinks";
import { FlightListRow } from "~/features/flight/components/List/FlightListRow";
import { RecordList } from "~/shared/ui/List/RecordList";

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
    <RecordList
      layout={trailingColumn.layout}
      loading={loading}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    >
      {flights.map((flight) => (
        <FlightListRow key={flight.id} flight={flight} links={links} trailingColumn={trailingColumn} />
      ))}
    </RecordList>
  );
}
