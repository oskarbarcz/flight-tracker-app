import React from "react";
import { Link } from "react-router";
import type { Flight } from "~/features/flight";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

type DebugFlightListBoxProps = {
  flights: Flight[];
};

export function DebugFlightListBox({ flights }: DebugFlightListBoxProps) {
  return (
    <Container padding="condensed" header={<CardHeader title="Flight list [debug]" />}>
      <div className="flex flex-col gap-1">
        {flights.map((flight) => {
          const tags: string[] = [flight.status, flight.tracking];
          if (flight.hasActiveEmergency) tags.push("emergency");
          if (flight.isFlightDiverted) tags.push("diverted");
          return (
            <Link
              key={flight.id}
              to={`/track/${flight.id}`}
              className="block font-mono text-xs text-gray-500 hover:text-indigo-500"
              viewTransition
            >
              {flight.flightNumber} [{tags.join(", ")}]
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
