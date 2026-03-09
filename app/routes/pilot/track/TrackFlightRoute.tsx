"use client";

import type { Route } from ".react-router/types/app/routes/pilot/track/+types/TrackFlightRoute";
import React from "react";
import { FlightTrackingDashboard } from "~/components/flight/Dashboard/Tracking/FlightTrackingDashboard";
import { TrackedFlightProvider } from "~/state/api/context/useTrackedFlight";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

export default function TrackFlightRoute({ params }: Route.ClientLoaderArgs) {
  usePageTitle("Tracking");

  return (
    <TrackedFlightProvider>
      <FlightTrackingDashboard flightId={params.id} />
    </TrackedFlightProvider>
  );
}
