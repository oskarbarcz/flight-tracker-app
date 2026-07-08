import React from "react";
import { FuelAndLoadsheetPanel } from "~/features/flight/components/FuelAndLoadsheet/FuelAndLoadsheetPanel";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";

export function FlightFuelAndLoadTab() {
  const { flight } = useTrackedFlight();

  if (!flight) return null;

  return (
    <div className="mt-4">
      <FuelAndLoadsheetPanel preliminary={flight.loadsheets.preliminary} final={flight.loadsheets.final} />
    </div>
  );
}
