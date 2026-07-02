import React from "react";
import { PlanFlightOptions } from "~/features/flight/components/PlanFlightOptions";
import { FlightListView } from "~/features/flight/components/Table/FlightListView";
import { FlightListProvider } from "~/features/flight/hooks/useFlightList";
import { FlightPhase } from "~/models";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";

const PHASES = [FlightPhase.Upcoming];

export default function FlightsListRoute() {
  usePageTitle("Plan new flight");

  return (
    <>
      <SectionHeader title="Plan new flight" />
      <FlightListProvider>
        <PlanFlightOptions />
        <FlightListView phases={PHASES} emptyMessage="No upcoming flights found." />
      </FlightListProvider>
    </>
  );
}
