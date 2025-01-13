"use client";

import React from "react";
import { FlightStateProvider } from "~/state/contexts/flight.state";
import { TrackFlightDashboard } from "~/components/TrackedFlightDashboard/TrackFlightDashboard";
import { useLoaderData } from "react-router";
import { ScheduledFlightsListElement } from "~/models";
import { FlightService } from "~/state/services/flight.service";
import { Route } from "../../../.react-router/types/app/routes/tracking/+types/TrackFlightRoute";
import ProtectedRoute from "~/routes/common/ProtectedRoute";

export function meta() {
  return [{ title: "Tracking | FlightModel Tracker" }];
}

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs): Promise<ScheduledFlightsListElement> {
  return FlightService.fetchFlightById(params.id);
}

export default function TrackFlightRoute() {
  const flight = useLoaderData<typeof clientLoader>();

  if (flight === undefined) {
    return;
  }

  return (
    <ProtectedRoute expectedRole="cabincrew">
      <FlightStateProvider>
        <TrackFlightDashboard flight={flight} />
      </FlightStateProvider>
    </ProtectedRoute>
  );
}
