import { Badge } from "flowbite-react";
import React from "react";
import type { Aircraft } from "~/features/aircraft";
import { AircraftAirportRow } from "~/features/aircraft/components/AircraftDetails/AircraftAirportRow";
import { aircraftStateColors } from "~/features/aircraft/i18n";
import type { Airport } from "~/features/airport";
import { toHuman } from "~/i18n/translate";
import { formatDate } from "~/shared/lib/time";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  aircraft: Aircraft;
  lastAirport: Airport | null;
};

export function AircraftStatusSummaryCard({ aircraft, lastAirport }: Props) {
  const lastSeen = aircraft.lastAirportUpdatedAt ? formatDate(new Date(aircraft.lastAirportUpdatedAt)) : null;

  return (
    <Container className="h-full" header={<CardHeader title="Current status" />}>
      <div className="flex flex-col gap-4">
        <Badge color={aircraftStateColors[aircraft.currentState]} size="sm" className="w-fit">
          {toHuman.aircraft.state(aircraft.currentState)}
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
