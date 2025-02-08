"use client";

import { FlightSummaryBox } from "~/components/Box/FlightSummaryBox";
import { FlightPhaseBox } from "~/components/Box/FlightPhaseBox";
import { AllDisplayBox } from "~/components/Box/AllDisplayBox";
import React, { useEffect } from "react";
import { useFlight } from "~/state/hooks/useFlight";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import FlightInfoHeader from "~/components/Box/FlightInfoHeader";
import { FlightStatus } from "~/models";
import StatusBox from "~/components/Box/StatusBox";
import { FlightTimerBox } from "~/components/Box/FlightTimerBox";

type TrackFlightDashboardProps = {
  flightId: string;
};

export function TrackFlightDashboard({ flightId }: TrackFlightDashboardProps) {
  const { flight, loadFlight } = useFlight();
  usePageTitle(flight ? `Tracking flight ${flight.flightNumber}` : "Tracking");

  useEffect(() => {
    loadFlight(flightId);
  }, [flightId, loadFlight]);

  if (!flight) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <FlightInfoHeader flight={flight} />
      {flight.status === FlightStatus.Closed && (
        <StatusBox>Flight has been closed.</StatusBox>
      )}
      <FlightSummaryBox flight={flight} />
      <FlightTimerBox flight={flight} />
      <AllDisplayBox flight={flight} />
      <FlightPhaseBox flight={flight} />
    </div>
  );
}
