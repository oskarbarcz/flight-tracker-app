import React from "react";
import { FlightHistoryListTable } from "~/components/flight/Table/FlightHistoryListTable";
import { TransparentContainer } from "~/components/shared/Layout/TransparentContainer";
import { SectionHeader } from "~/components/shared/Section/SectionHeader";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

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
