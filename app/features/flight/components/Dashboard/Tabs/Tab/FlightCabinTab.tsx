import React from "react";
import { FlightManifestPanel } from "~/features/flight/components/Cabin/FlightManifestPanel";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";

export function FlightCabinTab() {
  const { flight } = useTrackedFlight();

  if (flight === null) {
    return null;
  }

  return <FlightManifestPanel flight={flight} />;
}
