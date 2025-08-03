"use client";

import React from "react";
import { Flight } from "~/models";
import { Link } from "react-router";
import Container from "~/components/Layout/Container";
import ContainerTitle from "~/components/Layout/ContainerTitle";

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
