"use client";

import React from "react";
import { Flight } from "~/models";
import { Link } from "react-router";
import Container from "~/components/Container";

type CurrentFlightBoxProps = {
  flight?: Flight;
};

export default function CurrentFlightBox({ flight }: CurrentFlightBoxProps) {
  return (
    <Container>
      <h2 className="text-2xl pb-4 font-bold dark:text-gray-300">
        Current flight
      </h2>
      <div>
        {flight && (
          <div key={flight.id}>
            <Link
              to={`track/${flight.id}`}
              className="block text-teal-500 underline"
              viewTransition
            >
              {flight.flightNumber} [{flight.status}]
            </Link>
          </div>
        )}
      </div>
      <div></div>
    </Container>
  );
}
