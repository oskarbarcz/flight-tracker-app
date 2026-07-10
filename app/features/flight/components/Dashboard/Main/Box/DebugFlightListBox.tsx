import React from "react";
import { FaBug } from "react-icons/fa6";
import { Link } from "react-router";
import type { Flight } from "~/features/flight";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

type DebugFlightListBoxProps = {
  flights: Flight[];
};

export function DebugFlightListBox({ flights }: DebugFlightListBoxProps) {
  return (
    <Container padding="condensed">
      <ContainerTitle icon={FaBug} title="Flight list [debug]" />
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
