import type { Route } from ".react-router/types/app/routes/pilot/history/+types/FlightHistoryRoute";
import React from "react";
import { FlightHistoryDashboard } from "~/components/flight/Dashboard/History/FlightHistoryDashboard";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { HistoryFlightProvider } from "~/state/api/context/useHistoryFlight";
import { FlightService } from "~/state/api/flight.service";

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
