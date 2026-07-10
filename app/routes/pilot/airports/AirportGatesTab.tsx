import React from "react";
import { useAirportPreview } from "~/features/airport/components/Library/airportPreviewContext";
import { PreviewEmptyState } from "~/features/airport/components/Library/PreviewEmptyState";
import { GateList } from "~/features/gate/components/GateList";

export default function AirportGatesTab() {
  const { airport, gates, terminals, parkingPositions } = useAirportPreview();

  if (gates.length === 0) {
    return <PreviewEmptyState message="No gates recorded for this airport." />;
  }

  return (
    <GateList airportId={airport.id} gates={gates} terminals={terminals} parkingPositions={parkingPositions} readOnly />
  );
}
