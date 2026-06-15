"use client";

import React from "react";
import { FlightListView } from "~/components/flight/Table/FlightListView";
import type { TopNavRouteHandle } from "~/components/shared/TopNav/types";
import { FlightPhase } from "~/models";
import { FlightListProvider } from "~/state/api/context/useFlightList";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

const PHASES = [FlightPhase.Emergency, FlightPhase.Ongoing];

export const handle: TopNavRouteHandle = {
  breadcrumbs: () => [{ label: "Current flights" }],
};

export default function CurrentFlightsRoute() {
  usePageTitle("Current flights");

  return (
    <FlightListProvider limit={100}>
      <FlightListView phases={PHASES} emptyMessage="No flights are currently in the air." />
    </FlightListProvider>
  );
}
