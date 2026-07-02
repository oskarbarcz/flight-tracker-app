import React from "react";
import { FlightHistoryListTable } from "~/features/flight/components/Table/FlightHistoryListTable";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";

export default function FlightHistoryListRoute() {
  usePageTitle("Flight history");

  return (
    <>
      <SectionHeader title="Flight history" />
      <TransparentContainer>
        <FlightHistoryListTable />
      </TransparentContainer>
    </>
  );
}
