import React from "react";
import { FlightCargoPanel } from "~/features/cargo-manifest/components/FlightCargoPanel";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";

export function FlightCargoTab() {
  const { flight } = useTrackedFlight();

  if (flight === null) {
    return null;
  }

  return (
    <div className="mt-4">
      <FlightCargoPanel flight={flight} />
    </div>
  );
}
