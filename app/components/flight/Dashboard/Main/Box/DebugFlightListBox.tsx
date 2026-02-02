"use client";

import React from "react";
import { Link } from "react-router";
import Container from "~/components/shared/Layout/Container";
import ContainerTitle from "~/components/shared/Layout/ContainerTitle";
import { Flight } from "~/models";

type DebugFlightListBoxProps = {
  flights: Flight[];
};

export default function DebugFlightListBox({
  flights,
}: DebugFlightListBoxProps) {
  return (
    <Container padding="condensed">
      <ContainerTitle>Flight list [debug]</ContainerTitle>
      <div>
        {flights.map((flight) => (
          <div key={flight.id}>
            <Link
              to={`track/${flight.id}`}
              className="block text-teal-500 underline"
              viewTransition
            >
              {flight.flightNumber} [{flight.status}]
            </Link>
          </div>
        ))}
      </div>
      <div></div>
    </Container>
  );
}
