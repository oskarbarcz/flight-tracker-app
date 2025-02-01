"use client";

import React from "react";
import { FlightStateProvider } from "~/state/contexts/flight.state";
import { Route } from "../../../.react-router/types/app/routes/track/+types/TrackFlightRoute";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { UserRole } from "~/models/user.model";
import { TrackFlightDashboard } from "~/components/Dashboard/TrackFlightDashboard";

export function meta() {
  return [{ title: "Tracking | Flight Tracker" }];
}

export default function TrackFlightRoute({ params }: Route.ClientLoaderArgs) {
  return (
    <ProtectedRoute expectedRole={UserRole.CabinCrew}>
      <FlightStateProvider>
        <TrackFlightDashboard flightId={params.id} />
      </FlightStateProvider>
    </ProtectedRoute>
  );
}
