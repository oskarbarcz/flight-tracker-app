"use client";

import React from "react";
import { Flight, FlightStatus } from "~/models";
import { Link } from "react-router";
import Container from "~/components/Container";

type NextFlightBoxProps = {
  flights: Flight[];
};

export default function NextFlightBox({ flights }: NextFlightBoxProps) {
  const readyFlights = flights.filter(
    (flight: Flight) => flight.status === FlightStatus.Ready,
  );

  return (
    <Container>
      <h2 className="text-xl font-bold dark:text-gray-300">
        Available flights
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
    </Container>
  );
}
