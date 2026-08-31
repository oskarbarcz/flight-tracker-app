import React from "react";
import { FuelAndLoadsheetPanel } from "~/features/flight/components/FuelAndLoadsheet/FuelAndLoadsheetPanel";
import { useHistoryFlight } from "~/features/flight/hooks/useHistoryFlight";

export function HistoryFuelAndLoadTab() {
  const { flight, loadsheets } = useHistoryFlight();

  if (!flight) return null;

  return (
    <div className="mt-4">
      <FuelAndLoadsheetPanel
        flightId={flight.id}
        serviceType={flight.serviceType}
        preliminary={loadsheets.preliminary}
        final={loadsheets.final}
        timesheet={flight.timesheet}
      />
    </div>
  );
}
