import React from "react";
import { useAirportPreview } from "~/features/airport/components/Library/airportPreviewContext";
import { PreviewEmptyState } from "~/features/airport/components/Library/PreviewEmptyState";
import { ParkingPositionList } from "~/features/parking-position/components/ParkingPositionList";
import { NoFilterMatchesState } from "~/shared/ui/Filter/NoFilterMatchesState";

export default function AirportParkingTab() {
  const { airport, parkingPositions, terminals, isFiltered, clearFilter } = useAirportPreview();

  if (parkingPositions.length === 0) {
    return isFiltered ? (
      <NoFilterMatchesState subject="parking stands" onClear={clearFilter} />
    ) : (
      <PreviewEmptyState message="No parking stands recorded for this airport." />
    );
  }

  return (
    <ParkingPositionList
      airportId={airport.id}
      parkingPositions={parkingPositions}
      terminals={terminals}
      readOnly
      isFiltered={isFiltered}
    />
  );
}
