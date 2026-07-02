import React from "react";
import { FaBug } from "react-icons/fa6";
import { Link } from "react-router";
import type { Flight } from "~/models";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

type DebugFlightListBoxProps = {
  flights: Flight[];
};

export function DebugFlightListBox({ flights }: DebugFlightListBoxProps) {
  return (
    <Container padding="condensed">
      <ContainerTitle icon={FaBug} title="Flight list [debug]" />
      <div>
        {flights.map((flight) => {
          const tags: string[] = [flight.status, flight.tracking];
          if (flight.hasActiveEmergency) tags.push("emergency");
          if (flight.isFlightDiverted) tags.push("diverted");
          return (
            <div key={flight.id}>
              <Link to={`/track/${flight.id}`} className="block text-teal-500 underline" viewTransition>
                {flight.flightNumber} [{tags.join(", ")}]
              </Link>
            </div>
          );
        })}
      </div>
      <div></div>
    </Container>
  );
}
