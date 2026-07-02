import React from "react";
import { PlanFlightOptions } from "~/components/flight/PlanFlightOptions";
import { FlightListView } from "~/components/flight/Table/FlightListView";
import { SectionHeader } from "~/components/shared/Section/SectionHeader";
import { FlightPhase } from "~/models";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { FlightListProvider } from "~/state/api/context/useFlightList";

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
