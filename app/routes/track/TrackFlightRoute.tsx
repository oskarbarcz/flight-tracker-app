"use client";

import React from "react";
import { FlightStateProvider } from "~/state/contexts/flight.state";
import { Route } from "../../../.react-router/types/app/routes/track/+types/TrackFlightRoute";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { SimpleFlightDataDisplay } from "~/components/SimpleFlightDataDisplay";

export function meta() {
  return [{ title: "Tracking | FlightModel Tracker" }];
}

export default function TrackFlightRoute({ params }: Route.ClientLoaderArgs) {
  return (
    <ProtectedRoute expectedRole="cabincrew">
      <FlightStateProvider>
        <SimpleFlightDataDisplay flightId={params.id} />

        {/*<TrackFlightDashboard flight={flight} />*/}
      </FlightStateProvider>
    </ProtectedRoute>
  );
}
