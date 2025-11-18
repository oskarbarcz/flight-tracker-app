"use client";

import React from "react";
import Container from "~/components/shared/Layout/Container";
import ContainerTitle from "~/components/shared/Layout/ContainerTitle";
import { FlightTimerBox } from "~/components/flight/Dashboard/Tracking/FlightTimerBox";

export default function FlightScheduleBox() {
  return (
    <Container padding="condensed">
      <ContainerTitle>Schedule</ContainerTitle>
      <FlightTimerBox />
    </Container>
  );
}
