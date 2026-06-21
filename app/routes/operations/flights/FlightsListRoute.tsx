import React from "react";
import { PlanFlightOptions } from "~/components/flight/PlanFlightOptions";
import { FlightListView } from "~/components/flight/Table/FlightListView";
import type { TopNavRouteHandle } from "~/components/shared/TopNav/types";
import { FlightPhase } from "~/models";
import { FlightListProvider } from "~/state/api/context/useFlightList";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

const PHASES = [FlightPhase.Upcoming];

export const handle: TopNavRouteHandle = {
  breadcrumbs: () => [{ label: "Plan a flight" }],
};

export default function FlightsListRoute() {
  usePageTitle("Plan a flight");

  return (
    <FlightListProvider>
      <PlanFlightOptions />
      <FlightListView phases={PHASES} emptyMessage="No upcoming flights found." />
    </FlightListProvider>
  );
}
