import React from "react";
import { AircraftAirportRow } from "~/features/aircraft/components/AircraftDetails/AircraftAirportRow";
import type { Airport } from "~/features/airport";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";

type Props = {
  airport: Airport | null;
};

export function AircraftBaseAirportSummaryCard({ airport }: Props) {
  return (
    <Container header={<CardHeader title="Base airport" />}>
      {airport ? (
        <AircraftAirportRow airport={airport} />
      ) : (
        <ContainerEmptyState>No base airport assigned.</ContainerEmptyState>
      )}
    </Container>
  );
}
