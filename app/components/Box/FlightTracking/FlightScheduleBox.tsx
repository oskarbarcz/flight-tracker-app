"use client";

import React from "react";
import Container from "~/components/Layout/Container";
import ContainerTitle from "~/components/Layout/ContainerTitle";
import { FlightTimerBox } from "~/components/Box/FlightTracking/FlightTimerBox";

export default function FlightScheduleBox() {
  return (
    <Container padding="condensed">
      <ContainerTitle>Schedule</ContainerTitle>
      <FlightTimerBox />
    </Container>
  );
}
