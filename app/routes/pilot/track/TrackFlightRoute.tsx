"use client";

import React from "react";
import { FlightStateProvider } from "~/state/contexts/flight.state";
import { Route } from ".react-router/types/app/routes/pilot/track/+types/TrackFlightRoute";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { UserRole } from "~/models/user.model";
import FlightTrackingDashboard from "~/components/Dashboard/FlightTrackingDashboard";

export function meta() {
  return [{ title: "Tracking | FlightTracker" }];
}

export default function TrackFlightRoute({ params }: Route.ClientLoaderArgs) {
  return (
    <ProtectedRoute expectedRole={UserRole.CabinCrew}>
      <FlightStateProvider>
        <FlightTrackingDashboard flightId={params.id} />
      </FlightStateProvider>
    </ProtectedRoute>
  );
}
