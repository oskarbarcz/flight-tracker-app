"use client";

import React from "react";
import { FaRegCalendar } from "react-icons/fa6";
import { FlightTimerBox } from "~/components/flight/Dashboard/Tracking/Box/FlightTimerBox";
import { Container } from "~/components/shared/Layout/Container";
import { ContainerTitle } from "~/components/shared/Layout/ContainerTitle";

export function FlightScheduleBox() {
  return (
    <Container padding="condensed">
      <ContainerTitle icon={FaRegCalendar} title="Schedule" />
      <FlightTimerBox />
    </Container>
  );
}
