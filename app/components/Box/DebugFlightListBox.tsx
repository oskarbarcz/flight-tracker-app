"use client";

import React from "react";
import { Flight } from "~/models";
import { Link } from "react-router";
import Container from "~/components/Container";

type DebugFlightListBoxProps = {
  flights: Flight[];
};

export default function DebugFlightListBox({
  flights,
}: DebugFlightListBoxProps) {
  return (
    <Container>
      <h2 className="text-2xl pb-4 font-bold dark:text-gray-300">
        Flight list [debug]
      </h2>
      <div>
        {flights.map((flight) => (
          <div>
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
