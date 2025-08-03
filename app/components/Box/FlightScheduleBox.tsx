"use client";

import React from "react";
import Container from "~/components/Layout/Container";
import ContainerTitle from "~/components/Layout/ContainerTitle";
import { FlightTimerBox } from "~/components/Box/FlightTimerBox";
import { Flight } from "~/models";

type FlightScheduleBoxProps = {
  flight: Flight;
};

export default function FlightScheduleBox({ flight }: FlightScheduleBoxProps) {
  return (
    <Container padding="condensed">
      <ContainerTitle>Schedule</ContainerTitle>
      <FlightTimerBox flight={flight} />
    </Container>
  );
}
