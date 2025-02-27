"use client";

import React from "react";
import { Flight, isFlightTrackable } from "~/models";
import { Link } from "react-router";

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
    <section className="rounded-2xl border bg-gray-100 p-6 dark:border-gray-700 dark:bg-gray-800">
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
    </section>
  );
}
