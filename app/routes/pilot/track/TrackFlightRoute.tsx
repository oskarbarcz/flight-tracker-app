"use client";

import React from "react";
import { TrackedFlightProvider } from "~/state/contexts/global/tracked-flight.context";
import { Route } from ".react-router/types/app/routes/pilot/track/+types/TrackFlightRoute";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { UserRole } from "~/models/user.model";
import FlightTrackingDashboard from "~/components/Dashboard/FlightTrackingDashboard";

export function meta() {
  return [{ title: "Tracking | Flight Tracker" }];
}

export default function TrackFlightRoute({ params }: Route.ClientLoaderArgs) {
  return (
    <ProtectedRoute expectedRole={UserRole.CabinCrew}>
      <TrackedFlightProvider>
        <FlightTrackingDashboard flightId={params.id} />
      </TrackedFlightProvider>
    </ProtectedRoute>
  );
}
