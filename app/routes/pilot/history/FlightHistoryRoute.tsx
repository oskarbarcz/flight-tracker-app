import type { Route } from ".react-router/types/app/routes/pilot/history/+types/FlightHistoryRoute";
import React from "react";
import { FlightHistoryDashboard } from "~/features/flight/components/Dashboard/History/FlightHistoryDashboard";
import { HistoryFlightProvider } from "~/features/flight/hooks/useHistoryFlight";
import { FlightService } from "~/features/flight/service";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const flight = await new FlightService().fetchById(params.id);
  return { flight };
}

export default function FlightHistoryRoute({ params }: Route.ClientLoaderArgs) {
  usePageTitle("Flight history");

  return (
    <HistoryFlightProvider flightId={params.id}>
      <FlightHistoryDashboard />
    </HistoryFlightProvider>
  );
}
