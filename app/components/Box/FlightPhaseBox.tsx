"use client";

import { Flight, FlightStatus } from "~/models";
import FlightProgressControl from "~/components/FlightProgressControl/FlightProgressControl";
import React, { useState } from "react";
import { Button } from "flowbite-react";
import CheckInFlightModal from "~/components/Modal/CheckInFlightModal";

type FlightPhaseBoxProps = {
  flight: Flight;
};

export function FlightPhaseBox({ flight }: FlightPhaseBoxProps) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <section className="rounded-2xl border bg-gray-100 p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex h-full flex-col items-center justify-center">
        <FlightProgressControl flightId={flight.id} status={flight.status} />
        {flight.status === FlightStatus.Ready && (
          <>
            <Button className="mt-2" onClick={() => setOpenModal(true)}>
              Go to flight check-in
            </Button>
            <CheckInFlightModal
              openModal={openModal}
              setOpenModal={setOpenModal}
              flight={flight}
            />
          </>
        )}
      </div>
    </section>
  );
}
