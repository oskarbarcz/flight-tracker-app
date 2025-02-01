"use client";

import React, { useEffect, useState } from "react";
import { FlightStateProvider } from "~/state/contexts/flight.state";
import { Route } from "../../../.react-router/types/app/routes/track/+types/TrackFlightRoute";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { SimpleFlightDataDisplay } from "~/components/SimpleFlightDataDisplay";
import { UserRole } from "~/models/user.model";
import { FlightSummaryBox } from "~/components/Box/FlightSummaryBox";
import { Flight } from "~/models";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import { FlightPhaseBox } from "~/components/Box/FlightPhaseBox";
import { useFlightService } from "~/state/hooks/api/useFlightService";

export function meta() {
  return [{ title: "Tracking | Flight Tracker" }];
}

export default function TrackFlightRoute({ params }: Route.ClientLoaderArgs) {
  const flightService = useFlightService();
  const [flight, setFlight] = useState<Flight | null>(null);
  usePageTitle(flight ? `Tracking flight ${flight.flightNumber}` : "Tracking");

  useEffect(() => {
    flightService.fetchFlightById(params.id).then(setFlight);
  }, [params.id, flightService]);

  if (!flight) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute expectedRole={UserRole.CabinCrew}>
      <FlightStateProvider>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FlightSummaryBox flight={flight} />
          <FlightPhaseBox flight={flight} />
        </div>
        <SimpleFlightDataDisplay flight={flight} />
      </FlightStateProvider>
    </ProtectedRoute>
  );
}
