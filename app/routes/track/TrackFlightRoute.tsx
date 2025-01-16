"use client";

import React from "react";
import { FlightStateProvider } from "~/state/contexts/flight.state";
import { Navigate, useLoaderData } from "react-router";
import { isFlightAvailableForCheckIn, Flight } from "~/models";
import { FlightService } from "~/state/services/flight.service";
import { Route } from "../../../.react-router/types/app/routes/track/+types/TrackFlightRoute";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { SimpleFlightDataDisplay } from "~/components/SimpleFlightDataDisplay";

export function meta() {
  return [{ title: "Tracking | FlightModel Tracker" }];
}

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs): Promise<Flight> {
  return FlightService.fetchFlightById(params.id);
}

export default function TrackFlightRoute() {
  const flight = useLoaderData<typeof clientLoader>();

  if (flight === undefined) {
    return;
  }

  if (isFlightAvailableForCheckIn(flight.status)) {
    return <Navigate to={`/track/${flight.id}/check-in`} replace={true} />;
  }

  return (
    <ProtectedRoute expectedRole="cabincrew">
      <FlightStateProvider>
        <SimpleFlightDataDisplay flight={flight} />

        {/*<TrackFlightDashboard flight={flight} />*/}
      </FlightStateProvider>
    </ProtectedRoute>
  );
}
