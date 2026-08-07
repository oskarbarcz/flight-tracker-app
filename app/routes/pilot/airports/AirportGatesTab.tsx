import React from "react";
import { useAirportPreview } from "~/features/airport/components/Library/airportPreviewContext";
import { PreviewEmptyState } from "~/features/airport/components/Library/PreviewEmptyState";
import { GateList } from "~/features/gate/components/GateList";
import { NoFilterMatchesState } from "~/shared/ui/Filter/NoFilterMatchesState";

export default function AirportGatesTab() {
  const { airport, gates, terminals, parkingPositions, isFiltered, clearFilter } = useAirportPreview();

  if (gates.length === 0) {
    return isFiltered ? (
      <NoFilterMatchesState subject="gates" onClear={clearFilter} />
    ) : (
      <PreviewEmptyState message="No gates recorded for this airport." />
    );
  }

  return (
    <GateList
      airportId={airport.id}
      gates={gates}
      terminals={terminals}
      parkingPositions={parkingPositions}
      readOnly
      isFiltered={isFiltered}
    />
  );
}
