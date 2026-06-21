import type { Route } from ".react-router/types/app/routes/pilot/track/+types/TrackFlightRoute";
import React from "react";
import { redirect } from "react-router";
import { FlightTrackingDashboard } from "~/components/flight/Dashboard/Tracking/FlightTrackingDashboard";
import type { TopNavRouteHandle } from "~/components/shared/TopNav/types";
import { FlightStatus } from "~/models";
import { TrackedFlightProvider } from "~/state/api/context/useTrackedFlight";
import { FlightService } from "~/state/api/flight.service";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const flight = await new FlightService().fetchById(params.id);
  if (flight.status === FlightStatus.Closed) {
    throw redirect(`/flight-history/${flight.id}`);
  }
  return { flight };
}

export const handle: TopNavRouteHandle = {
  breadcrumbs: () => [{ label: "Dashboard", to: "/dashboard" }, { label: <span className="font-mono">Tracking</span> }],
};

export default function TrackFlightRoute({ params }: Route.ClientLoaderArgs) {
  usePageTitle("Tracking");

  return (
    <TrackedFlightProvider>
      <FlightTrackingDashboard flightId={params.id} />
    </TrackedFlightProvider>
  );
}
