import React from "react";
import { FlightPhase } from "~/features/flight";
import { FlightListView } from "~/features/flight/components/Table/FlightListView";
import { FlightListProvider } from "~/features/flight/hooks/useFlightList";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";

const PHASES = [FlightPhase.Emergency, FlightPhase.Ongoing];

export default function CurrentFlightsRoute() {
  usePageTitle("Current flights");

  return (
    <>
      <SectionHeader title="Current flights" />
      <FlightListProvider limit={100}>
        <FlightListView phases={PHASES} emptyMessage="No flights are currently in the air." />
      </FlightListProvider>
    </>
  );
}
