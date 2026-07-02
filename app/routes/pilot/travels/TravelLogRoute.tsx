import React from "react";
import { TravelLogTable } from "~/components/flight/Table/TravelLogTable";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";

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
