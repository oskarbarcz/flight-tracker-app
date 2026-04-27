"use client";

import { Alert, Button } from "flowbite-react";
import React from "react";
import { HiInformationCircle } from "react-icons/hi";
import { type Flight, FlightStatus } from "~/models";

type Props = {
  flight: Flight;
  onUpdate?: (flight: Flight) => void;
};

export function PreliminaryLoadsheetCard({ flight, onUpdate }: Props) {
  const canUpdate = onUpdate && flight.status === FlightStatus.Created;
  const loadsheet = flight.loadsheets.preliminary;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold dark:text-white">Preliminary loadsheet</h3>
        {canUpdate && (
          <Button
            onClick={() => onUpdate(flight)}
            color="gray"
            outline
            size="xs"
            className="flex cursor-pointer items-center"
          >
            Update
          </Button>
        )}
      </div>

      {loadsheet ? (
        <div className="flex flex-wrap gap-6">
          <Stat label="Pilots" value={loadsheet.flightCrew.pilots.toString()} />
          <Stat label="Relief pilots" value={loadsheet.flightCrew.reliefPilots.toString()} />
          <Stat label="Cabin crew" value={loadsheet.flightCrew.cabinCrew.toString()} />
          <Stat label="Passengers" value={loadsheet.passengers.toString()} />
          <Stat label="Zero-fuel weight" value={loadsheet.zeroFuelWeight.toString()} unit="t" />
          <Stat label="Cargo" value={loadsheet.cargo.toString()} unit="t" />
          <Stat label="Payload" value={loadsheet.payload.toString()} unit="t" />
          <Stat label="Block fuel" value={loadsheet.blockFuel.toString()} unit="t" />
        </div>
      ) : (
        <Alert color="warning" icon={HiInformationCircle}>
          Preliminary loadsheet is missing.
        </Alert>
      )}
    </section>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="text-center">
      <span className="mb-1 block text-xs">{label}</span>
      <span className="block font-mono font-bold text-gray-900 dark:text-white">
        {value}
        {unit && <span className="text-xs">{unit}</span>}
      </span>
    </div>
  );
}
