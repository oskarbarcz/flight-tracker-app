import React from "react";
import { useHistoryFlight } from "~/features/flight/hooks/useHistoryFlight";
import { RouteBriefingPanel } from "~/features/route/components/RouteBriefingPanel";

export function HistoryRouteTab() {
  const { flight } = useHistoryFlight();

  if (!flight) {
    return null;
  }

  return <RouteBriefingPanel flight={flight} airportHref={(airportId) => `/airports-library/${airportId}`} />;
}
