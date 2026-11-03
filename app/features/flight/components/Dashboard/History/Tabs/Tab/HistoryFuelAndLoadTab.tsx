import React from "react";
import { FuelAndLoadsheetPanel } from "~/features/flight/components/FuelAndLoadsheet/FuelAndLoadsheetPanel";
import { useHistoryFlight } from "~/features/flight/hooks/useHistoryFlight";
import { RouteBriefingProvider } from "~/features/route/hooks/useRouteBriefing";

export function HistoryFuelAndLoadTab() {
  const { flight, loadsheets } = useHistoryFlight();

  if (!flight) return null;

  return (
    <RouteBriefingProvider flight={flight}>
      <div className="mt-4">
        <FuelAndLoadsheetPanel
          flightId={flight.id}
          serviceType={flight.serviceType}
          preliminary={loadsheets.preliminary}
          final={loadsheets.final}
          timesheet={flight.timesheet}
        />
      </div>
    </RouteBriefingProvider>
  );
}
