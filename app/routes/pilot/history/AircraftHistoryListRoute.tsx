import React from "react";
import { UserAircraftHistoryTable } from "~/features/aircraft/components/Table/UserAircraftHistoryTable";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";

export default function AircraftHistoryListRoute() {
  usePageTitle("Aircraft history");

  return (
    <>
      <SectionHeader title="Aircraft history" />
      <TransparentContainer>
        <UserAircraftHistoryTable />
      </TransparentContainer>
    </>
  );
}
