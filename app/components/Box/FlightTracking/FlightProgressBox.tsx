"use client";

import React from "react";
import Container from "~/components/Layout/Container";
import ContainerTitle from "~/components/Layout/ContainerTitle";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";
import { FlightStatus } from "~/models";
import ChangeFlightProgressButton from "~/components/Box/FlightTracking/FlightProgressControl/ChangeFlightProgressButton";
import translateFlightStatus from "~/models/translate/flight.translate";

function showNextAction(status: FlightStatus): boolean {
  return [
    FlightStatus.Ready,
    FlightStatus.CheckedIn,
    FlightStatus.BoardingStarted,
    FlightStatus.BoardingFinished,
    FlightStatus.TaxiingOut,
    FlightStatus.InCruise,
    FlightStatus.TaxiingIn,
    FlightStatus.OnBlock,
    FlightStatus.OffboardingStarted,
    FlightStatus.OffboardingFinished,
  ].includes(status);
}

export default function FlightProgressBox() {
  const { flight } = useTrackedFlight();

  if (!flight) return null;

  return (
    <Container padding="condensed">
      <ContainerTitle>Flight progress</ContainerTitle>
      <div className="text-center uppercase font-bold text-indigo-500 text-xl my-8">
        {translateFlightStatus(flight.status)}
      </div>
      {showNextAction(flight.status) && <ChangeFlightProgressButton />}
    </Container>
  );
}
