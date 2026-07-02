import React from "react";
import { TravelLogTable } from "~/features/flight/components/Table/TravelLogTable";
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
