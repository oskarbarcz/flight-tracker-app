import React from "react";
import { FuelAndLoadsheetPanel } from "~/features/flight/components/FuelAndLoadsheet/FuelAndLoadsheetPanel";
import { useHistoryFlight } from "~/features/flight/hooks/useHistoryFlight";

export function HistoryFuelAndLoadTab() {
  const { flight } = useHistoryFlight();

  if (!flight) return null;

  return (
    <div className="mt-4">
      <FuelAndLoadsheetPanel preliminary={flight.loadsheets.preliminary} final={flight.loadsheets.final} />
    </div>
  );
}
