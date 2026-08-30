import React from "react";
import type { Airport } from "~/features/airport";
import { AirportListRow } from "~/features/airport/components/List/AirportListRow";
import { airportListLayout } from "~/features/airport/components/List/airportListLayout";
import { RecordList } from "~/shared/ui/List/RecordList";

type Props = {
  airports: Airport[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEnrich: (airport: Airport) => void;
};

export function AirportList({ airports, loading, page, totalPages, onPageChange, onEnrich }: Props) {
  return (
    <RecordList
      layout={airportListLayout}
      loading={loading}
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    >
      {airports.map((airport) => (
        <AirportListRow key={airport.id} airport={airport} onEnrich={onEnrich} />
      ))}
    </RecordList>
  );
}
