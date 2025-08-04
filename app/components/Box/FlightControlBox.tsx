"use client";

import React from "react";
import Container from "~/components/Layout/Container";
import ContainerTitle from "~/components/Layout/ContainerTitle";
import { FlightPhaseBox } from "~/components/Box/FlightPhaseBox";

export default function FlightControlBox() {
  return (
    <Container padding="condensed">
      <ContainerTitle>Flight control</ContainerTitle>
      <FlightPhaseBox />
    </Container>
  );
}
