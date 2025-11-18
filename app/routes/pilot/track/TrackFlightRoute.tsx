"use client";

import { Route } from ".react-router/types/app/routes/pilot/track/+types/TrackFlightRoute";
import React from "react";
import FlightTrackingDashboard from "~/components/flight/Dashboard/Tracking/FlightTrackingDashboard";
import { UserRole } from "~/models/user.model";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { TrackedFlightProvider } from "~/state/contexts/global/tracked-flight.context";

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
