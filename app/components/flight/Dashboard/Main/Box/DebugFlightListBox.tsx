import React from "react";
import { FaBug } from "react-icons/fa6";
import { Link } from "react-router";
import { Container } from "~/components/shared/Layout/Container";
import { ContainerTitle } from "~/components/shared/Layout/ContainerTitle";
import type { Flight } from "~/models";

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
