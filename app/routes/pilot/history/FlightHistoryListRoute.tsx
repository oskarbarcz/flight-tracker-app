import React from "react";
import { PilotFlightHistoryList } from "~/features/flight/components/List/PilotFlightHistoryList";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";

export default function FlightHistoryListRoute() {
  usePageTitle("Flight history");

  return (
    <>
      <SectionHeader title="Flight history" />
      <PilotFlightHistoryList />
    </>
  );
}
