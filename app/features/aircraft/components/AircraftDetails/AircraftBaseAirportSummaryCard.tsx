import React from "react";
import { HiOutlineHome } from "react-icons/hi";
import { AircraftAirportRow } from "~/features/aircraft/components/AircraftDetails/AircraftAirportRow";
import type { Airport } from "~/features/airport";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

type Props = {
  airport: Airport | null;
};

export function AircraftBaseAirportSummaryCard({ airport }: Props) {
  return (
    <Container>
      <ContainerTitle icon={HiOutlineHome} title="Base airport" />

      {airport ? (
        <AircraftAirportRow airport={airport} />
      ) : (
        <ContainerEmptyState>No base airport assigned.</ContainerEmptyState>
      )}
    </Container>
  );
}
