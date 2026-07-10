import React from "react";
import { useAirportPreview } from "~/features/airport/components/Library/airportPreviewContext";
import { PreviewEmptyState } from "~/features/airport/components/Library/PreviewEmptyState";
import { ParkingPositionList } from "~/features/parking-position/components/ParkingPositionList";

export default function AirportParkingTab() {
  const { airport, parkingPositions, terminals } = useAirportPreview();

  if (parkingPositions.length === 0) {
    return <PreviewEmptyState message="No parking positions recorded for this airport." />;
  }

  return (
    <ParkingPositionList airportId={airport.id} parkingPositions={parkingPositions} terminals={terminals} readOnly />
  );
}
