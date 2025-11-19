"use client";

import React from "react";
import ChangeFlightProgressButton from "~/components/flight/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import Container from "~/components/shared/Layout/Container";
import ContainerTitle from "~/components/shared/Layout/ContainerTitle";
import { FlightStatus } from "~/models";
import translateFlightStatus from "~/models/translate/flight.translate";
import { useTrackedFlight } from "~/state/contexts/global/tracked-flight.context";

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
        <div className="w-full mb-2">
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
