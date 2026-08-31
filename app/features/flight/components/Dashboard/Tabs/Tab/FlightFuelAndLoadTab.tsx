import React from "react";
import { FuelAndLoadsheetPanel } from "~/features/flight/components/FuelAndLoadsheet/FuelAndLoadsheetPanel";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";

export function FlightFuelAndLoadTab() {
  const { flight, loadsheets } = useTrackedFlight();

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
