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
    <Container padding="condensed" className="relative">
      <ContainerTitle>Flight progress</ContainerTitle>
      <div className="flex items-center flex-wrap text-lg">
        <div className="w-1/2 shrink-0 mb-2">
          <span className="text-gray-500 text-sm">Flight status</span>
          <p className="font-bold text-indigo-500">
            {translateFlightStatus(flight.status)}
          </p>
        </div>
      </div>
      <hr className="mt-1 mb-3 border-gray-300 dark:border-gray-700" />
      <div className="absolute bottom-0 right-0 left-0 p-4">
        <hr className="w-full mt-1 mb-3 border-gray-300 dark:border-gray-700" />
        {showNextAction(flight.status) && <ChangeFlightProgressButton />}
      </div>
    </Container>
  );
}
