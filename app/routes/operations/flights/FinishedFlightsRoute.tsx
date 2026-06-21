import React from "react";
import { FlightListView } from "~/components/flight/Table/FlightListView";
import type { TopNavRouteHandle } from "~/components/shared/TopNav/types";
import { FlightPhase } from "~/models";
import { FlightListProvider } from "~/state/api/context/useFlightList";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

const PHASES = [FlightPhase.Finished];

export const handle: TopNavRouteHandle = {
  breadcrumbs: () => [{ label: "Flight history" }],
};

export default function FinishedFlightsRoute() {
  usePageTitle("Flight history");

  return (
    <FlightListProvider>
      <FlightListView phases={PHASES} emptyMessage="No finished flights found." />
    </FlightListProvider>
  );
}
