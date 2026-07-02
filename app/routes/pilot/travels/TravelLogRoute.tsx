import React from "react";
import { TravelLogTable } from "~/components/flight/Table/TravelLogTable";
import { TransparentContainer } from "~/components/shared/Layout/TransparentContainer";
import { SectionHeader } from "~/components/shared/Section/SectionHeader";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

export default function TravelLogRoute() {
  usePageTitle("Travel log");

  return (
    <>
      <SectionHeader title="Travel log" />
      <TransparentContainer>
        <TravelLogTable />
      </TransparentContainer>
    </>
  );
}
