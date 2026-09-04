import React from "react";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { RouteBriefingPanel } from "~/features/route/components/RouteBriefingPanel";

export function FlightRouteTab() {
  const { flight } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  return <RouteBriefingPanel flight={flight} airportHref={(airportId) => `/airports-library/${airportId}`} />;
}
