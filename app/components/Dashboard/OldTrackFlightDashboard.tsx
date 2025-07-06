"use client";

import { FlightPhaseBox } from "~/components/Box/FlightPhaseBox";
import React, { useEffect } from "react";
import { useFlight } from "~/state/hooks/useFlight";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import FlightInfoBox from "~/components/Box/FlightInfoBox";
import { FlightStatus } from "~/models";
import StatusBox from "~/components/Box/StatusBox";
import { FlightTimerBox } from "~/components/Box/FlightTimerBox";

type OldTrackFlightDashboardProps = {
  flightId: string;
};

export function OldTrackFlightDashboard({
  flightId,
}: OldTrackFlightDashboardProps) {
  const { flight, loadFlight } = useFlight();
  usePageTitle(flight ? `Tracking flight ${flight.flightNumber}` : "Tracking");

  useEffect(() => {
    loadFlight(flightId).then();
  }, [flightId, loadFlight]);

  if (!flight) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <FlightInfoBox flight={flight} />
      {flight.status === FlightStatus.Closed && (
        <StatusBox>Flight has been closed.</StatusBox>
      )}
      <FlightTimerBox flight={flight} />
      <FlightPhaseBox flight={flight} />
    </div>
  );
}
