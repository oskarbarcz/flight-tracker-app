"use client";

import React from "react";
import { Flight, isFlightTrackable } from "~/models";
import { Link } from "react-router";
import Container from "~/components/Container";

type AllPendingFlightsBoxProps = {
  flights: Flight[];
};

export default function AllPendingFlightsBox({
  flights,
}: AllPendingFlightsBoxProps) {
  const readyFlights = flights.filter((flight: Flight) =>
    isFlightTrackable(flight.status),
  );

  return (
    <Container>
      <h2 className="text-xl font-bold dark:text-gray-300">
        Trackable flights
      </h2>
      <div className="mt-2">
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
