"use client";

import type { Route } from ".react-router/types/app/routes/pilot/history/+types/FlightHistoryRoute";
import React from "react";
import { FlightHistoryDashboard } from "~/components/flight/Dashboard/History/FlightHistoryDashboard";
import type { TopNavRouteHandle } from "~/components/shared/TopNav/types";
import type { Flight } from "~/models";
import { HistoryFlightProvider } from "~/state/api/context/useHistoryFlight";
import { FlightService } from "~/state/api/flight.service";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function formatCompactFlightDate(date: Date): string {
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = MONTHS[date.getUTCMonth()];
  return `${day}${month}`;
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const flight = await new FlightService().fetchById(params.id);
  return { flight };
}

export const handle: TopNavRouteHandle = {
  breadcrumbs: (data) => {
    const { flight } = data as { flight: Flight };
    const date = formatCompactFlightDate(flight.timesheet.scheduled.takeoffTime);
    return [
      { label: "Flight history", to: "/flight-history" },
      {
        label: (
          <span className="font-mono">
            {flight.flightNumberWithoutSpaces} · {date}
          </span>
        ),
      },
    ];
  },
};

export default function FlightHistoryRoute({ params }: Route.ClientLoaderArgs) {
  usePageTitle("Flight history");

  return (
    <HistoryFlightProvider flightId={params.id}>
      <FlightHistoryDashboard />
    </HistoryFlightProvider>
  );
}
