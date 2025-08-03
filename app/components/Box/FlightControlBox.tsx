"use client";

import React from "react";
import Container from "~/components/Layout/Container";
import ContainerTitle from "~/components/Layout/ContainerTitle";
import { FlightPhaseBox } from "~/components/Box/FlightPhaseBox";
import { Flight } from "~/models";

type FlightControlBoxProps = {
  flight: Flight;
};

export default function FlightControlBox({ flight }: FlightControlBoxProps) {
  return (
    <Container padding="condensed">
      <ContainerTitle>Flight control</ContainerTitle>
      <FlightPhaseBox flight={flight} />
    </Container>
  );
}
