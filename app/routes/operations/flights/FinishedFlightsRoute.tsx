import React from "react";
import { FlightListView } from "~/components/flight/Table/FlightListView";
import { SectionHeader } from "~/components/shared/Section/SectionHeader";
import { FlightPhase } from "~/models";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { FlightListProvider } from "~/state/api/context/useFlightList";

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
