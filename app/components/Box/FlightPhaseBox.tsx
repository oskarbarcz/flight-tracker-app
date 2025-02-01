"use client";

import { Flight } from "~/models";

type FlightPhaseBoxProps = {
  flight: Flight;
};

export function FlightPhaseBox({ flight }: FlightPhaseBoxProps) {
  return (
    <section className="rounded-lg bg-gray-100 p-4 shadow dark:bg-gray-800">
      <h2 className="text-xl font-bold dark:text-gray-300">Flight phase</h2>
      <hr className="mt-2 dark:border-gray-700" />
      {flight.status}
    </section>
  );
}
