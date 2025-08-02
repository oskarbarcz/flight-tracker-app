"use client";

import React from "react";
import { Flight, isFlightTrackable } from "~/models";
import { Link } from "react-router";
import Container from "~/components/Container";

type PilotStatsBoxProps = {
  flights: Flight[];
};

export default function PilotStatsBox({ flights }: PilotStatsBoxProps) {
  const readyFlights = flights.filter((flight: Flight) =>
    isFlightTrackable(flight.status),
  );

  return (
    <Container>
      <h2 className="text-2xl pb-4 font-bold dark:text-gray-300">
        Last month summary
      </h2>
      <div>
        {readyFlights.map((flight: Flight) => (
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
