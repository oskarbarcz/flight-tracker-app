"use client";

import React from "react";
import { FlightStateProvider } from "~/state/contexts/flight.state";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { UserRole } from "~/models/user.model";
import { OldTrackFlightDashboard } from "~/components/Dashboard/OldTrackFlightDashboard";
import { Route } from "../../../../.react-router/types/app/routes/pilot/track/+types/OldTrackFlightRoute";

export function meta() {
  return [{ title: "Tracking | Flight Tracker" }];
}

export default function OldTrackFlightRoute({
  params,
}: Route.ClientLoaderArgs) {
  return (
    <ProtectedRoute expectedRole={UserRole.CabinCrew}>
      <FlightStateProvider>
        <OldTrackFlightDashboard flightId={params.id} />
      </FlightStateProvider>
    </ProtectedRoute>
  );
}
