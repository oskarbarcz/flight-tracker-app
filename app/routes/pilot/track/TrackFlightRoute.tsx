import type { Route } from ".react-router/types/app/routes/pilot/track/+types/TrackFlightRoute";
import React from "react";
import { FlightTrackingDashboard } from "~/features/flight/components/Dashboard/Tracking/FlightTrackingDashboard";
import { TrackedFlightProvider } from "~/features/flight/hooks/useTrackedFlight";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

export default function TrackFlightRoute({ params }: Route.ComponentProps) {
  usePageTitle("Tracking");

  return (
    <TrackedFlightProvider>
      <FlightTrackingDashboard flightId={params.id} />
    </TrackedFlightProvider>
  );
}
