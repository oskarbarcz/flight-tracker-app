import React from "react";
import { FlightHistoryListTable } from "~/components/flight/Table/FlightHistoryListTable";
import { TransparentContainer } from "~/components/shared/Layout/TransparentContainer";
import { SectionHeader } from "~/components/shared/Section/SectionHeader";
import type { TopNavRouteHandle } from "~/components/shared/TopNav/types";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";

export const handle: TopNavRouteHandle = {
  breadcrumbs: () => [{ label: "Flight history" }],
};

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
