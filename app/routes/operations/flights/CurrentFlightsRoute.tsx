import React from "react";
import { FlightListView } from "~/components/flight/Table/FlightListView";
import { SectionHeader } from "~/components/shared/Section/SectionHeader";
import { FlightPhase } from "~/models";
import { FlightListProvider } from "~/state/api/context/useFlightList";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

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
