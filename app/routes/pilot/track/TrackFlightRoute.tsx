import type { Route } from ".react-router/types/app/routes/pilot/track/+types/TrackFlightRoute";
import React from "react";
import { redirect } from "react-router";
import { FlightStatus } from "~/features/flight";
import { FlightTrackingDashboard } from "~/features/flight/components/Dashboard/Tracking/FlightTrackingDashboard";
import { TrackedFlightProvider } from "~/features/flight/hooks/useTrackedFlight";
import { FlightService } from "~/features/flight/service";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const flight = await new FlightService().fetchById(params.id);
  if (flight.status === FlightStatus.Closed) {
    throw redirect(`/flight-history/${flight.id}`);
  }
  return { flight };
}

export default function TrackFlightRoute({ params }: Route.ClientLoaderArgs) {
  usePageTitle("Tracking");

  return (
    <TrackedFlightProvider>
      <FlightTrackingDashboard flightId={params.id} />
    </TrackedFlightProvider>
  );
}
