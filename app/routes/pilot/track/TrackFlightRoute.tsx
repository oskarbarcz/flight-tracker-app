"use client";

import type { Route } from ".react-router/types/app/routes/pilot/track/+types/TrackFlightRoute";
import React from "react";
import FlightTrackingDashboard from "~/components/flight/Dashboard/Tracking/FlightTrackingDashboard";
import { TrackedFlightProvider } from "~/state/api/context/useTrackedFlight";

export function meta() {
  return [{ title: "Tracking | Flight Tracker" }];
}

export default function TrackFlightRoute({ params }: Route.ClientLoaderArgs) {
  return (
    <TrackedFlightProvider>
      <FlightTrackingDashboard flightId={params.id} />
    </TrackedFlightProvider>
  );
}
