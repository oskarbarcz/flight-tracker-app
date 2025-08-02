"use client";

import React from "react";
import { Flight } from "~/models";
import { Link } from "react-router";
import Container from "~/components/Container";

type AvailableFlightsBoxProps = {
  flight: Flight | undefined;
};

export default function AvailableFlightsBox({
  flight,
}: AvailableFlightsBoxProps) {
  return (
    <Container>
      <h2 className="text-2xl pb-4 font-bold dark:text-gray-300">
        Available flights
      </h2>

      {flight && (
        <div>
          <Link
            to={`track/${flight.id}`}
            className="block text-teal-500 underline"
            viewTransition
          >
            {flight.flightNumber} [{flight.status}]
          </Link>
        </div>
      )}
    </Container>
  );
}
