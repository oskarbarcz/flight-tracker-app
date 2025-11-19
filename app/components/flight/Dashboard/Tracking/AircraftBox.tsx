"use client";

import React from "react";
import { FaCircleInfo } from "react-icons/fa6";
import Container from "~/components/shared/Layout/Container";
import ContainerTitle from "~/components/shared/Layout/ContainerTitle";
import { useTrackedFlight } from "~/state/contexts/global/tracked-flight.context";

export default function AircraftBox() {
  const { flight } = useTrackedFlight();

  if (!flight) {
    return (
      <Container padding="condensed">
        <ContainerTitle>Aircraft</ContainerTitle>
        <div className="min-h-[100px] flex items-center justify-center text-gray-500">
          <FaCircleInfo className="inline mr-2" />
          <span>Aircraft details will be available soon.</span>
        </div>
      </Container>
    );
  }

  return (
    <Container padding="condensed">
      <ContainerTitle>Aircraft</ContainerTitle>
      <div className="mb-2 text-lg">
        <span className="text-gray-500 text-sm">Owner</span>
        <p className="font-bold">{flight.aircraft.operator.shortName}</p>
      </div>
      <div className="flex flex-wrap text-lg">
        <div className="w-1/2 shrink-0 mb-2">
          <span className="text-gray-500 text-sm">Model</span>
          <p className="font-bold">{flight.aircraft.fullName}</p>
        </div>
        <div className="w-1/2 shrink-0">
          <span className="text-gray-500 text-sm">Type</span>
          <p className="font-bold">{flight.aircraft.icaoCode}</p>
        </div>
        <div className="w-1/2">
          <span className="text-gray-500 text-sm block">Airframe</span>
          <p className="mt-1 inline-block font-bold border rounded-lg border-gray-600 dark:border-gray-400 px-2 py-0.5 text-sm">
            {flight.aircraft.registration}
          </p>
        </div>
        <div className="w-1/2">
          <span className="text-gray-500 text-sm block">SELCAL</span>
          <p className="mt-1 inline-block font-bold border border-gray-600 dark:border-gray-400 px-2 py-0.5 text-sm">
            {flight.aircraft.selcal}
          </p>
        </div>
      </div>
    </Container>
  );
}
