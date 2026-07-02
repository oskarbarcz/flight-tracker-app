import React from "react";
import { FlightPhase } from "~/features/flight";
import { FlightListView } from "~/features/flight/components/Table/FlightListView";
import { FlightListProvider } from "~/features/flight/hooks/useFlightList";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";

const PHASES = [FlightPhase.Finished];

export default function FinishedFlightsRoute() {
  usePageTitle("Flight history");

  return (
    <>
      <SectionHeader title="Flight history" />
      <FlightListProvider>
        <FlightListView phases={PHASES} emptyMessage="No finished flights found." />
      </FlightListProvider>
    </>
  );
}
