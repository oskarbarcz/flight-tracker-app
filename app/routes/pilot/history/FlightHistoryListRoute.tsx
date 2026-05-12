"use client";

import React from "react";
import { FlightHistoryListTable } from "~/components/flight/Table/FlightHistoryListTable";
import { Container } from "~/components/shared/Layout/Container";
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
      <Container padding="none">
        <FlightHistoryListTable />
      </Container>
    </>
  );
}
