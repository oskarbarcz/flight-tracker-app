import { Badge } from "flowbite-react";
import React from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { type Aircraft, AircraftState } from "~/features/aircraft";
import { AircraftAirportRow } from "~/features/aircraft/components/AircraftDetails/AircraftAirportRow";
import type { Airport } from "~/features/airport";
import { formatDate } from "~/shared/lib/time";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

const stateLabels: Record<AircraftState, { label: string; color: string }> = {
  [AircraftState.Idle]: { label: "Idle", color: "gray" },
  [AircraftState.Planned]: { label: "Planned", color: "purple" },
  [AircraftState.CheckedIn]: { label: "Checked in", color: "indigo" },
  [AircraftState.Cruise]: { label: "In cruise to:", color: "info" },
};

type Props = {
  aircraft: Aircraft;
  lastAirport: Airport | null;
};

export function AircraftStatusSummaryCard({ aircraft, lastAirport }: Props) {
  const state = stateLabels[aircraft.currentState];
  const lastSeen = aircraft.lastAirportUpdatedAt ? formatDate(new Date(aircraft.lastAirportUpdatedAt)) : null;

  return (
    <Container className="h-full">
      <ContainerTitle icon={HiOutlineLocationMarker} title="Current status" />

      <div className="flex flex-col gap-4">
        <Badge color={state.color} size="sm" className="w-fit">
          {state.label}
        </Badge>

        {lastAirport ? (
          <AircraftAirportRow airport={lastAirport} />
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">Location unknown</span>
        )}

        {aircraft.lastParkingPosition && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Parked at{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-100">{aircraft.lastParkingPosition.name}</span>
          </div>
        )}
      </div>

      {lastSeen && <div className="mt-auto text-xs text-gray-500 dark:text-gray-400">Updated {lastSeen}</div>}
    </Container>
  );
}
