import React from "react";
import { useHistoryFlight } from "~/features/flight/hooks/useHistoryFlight";
import { RouteBriefingPanel } from "~/features/route/components/RouteBriefingPanel";
import { RouteBriefingProvider } from "~/features/route/hooks/useRouteBriefing";

export function HistoryRouteTab() {
  const { flight } = useHistoryFlight();

  if (!flight) {
    return null;
  }

  return (
    <RouteBriefingProvider flight={flight}>
      <RouteBriefingPanel flight={flight} airportHref={(airportId) => `/airports-library/${airportId}`} />
    </RouteBriefingProvider>
  );
}
