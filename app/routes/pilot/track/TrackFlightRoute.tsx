"use client";

import type { Route } from ".react-router/types/app/routes/pilot/track/+types/TrackFlightRoute";
import React from "react";
import { FlightTrackingDashboard } from "~/components/flight/Dashboard/Tracking/FlightTrackingDashboard";
import type { TopNavRouteHandle } from "~/components/shared/TopNav/types";
import { type Flight, FlightStatus } from "~/models";
import { TrackedFlightProvider } from "~/state/api/context/useTrackedFlight";
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
    if (flight.status === FlightStatus.Closed) {
      const date = formatCompactFlightDate(flight.timesheet.scheduled.takeoffTime);
      return [
        { label: "Flight history", to: "/dashboard" },
        {
          label: (
            <span className="font-mono">
              {flight.flightNumberWithoutSpaces} · {date}
            </span>
          ),
        },
      ];
    }
    return [
      { label: "Dashboard", to: "/dashboard" },
      { label: <span className="font-mono">Tracking · {flight.flightNumberWithoutSpaces}</span> },
    ];
  },
};

export default function TrackFlightRoute({ params }: Route.ClientLoaderArgs) {
  usePageTitle("Tracking");

  return (
    <TrackedFlightProvider>
      <FlightTrackingDashboard flightId={params.id} />
    </TrackedFlightProvider>
  );
}
