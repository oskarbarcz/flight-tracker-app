"use client";

import { FilledSchedule, Flight, FlightStatus } from "~/models";
import FlightProgressControl from "~/components/FlightProgressControl/FlightProgressControl";
import React, { useState } from "react";
import { Button } from "flowbite-react";
import CheckInFlightModal from "~/components/Modal/CheckInFlightModal";
import { useFlight } from "~/state/hooks/useFlight";
import { formattedToISO } from "~/functions/time";

type FlightPhaseBoxProps = {
  flight: Flight;
};

export function FlightPhaseBox({ flight }: FlightPhaseBoxProps) {
  const [showModal, setShowModal] = useState(false);
  const { checkIn } = useFlight();

  const handleCheckIn = (schedule: FilledSchedule) => {
    const normalizedSchedule = {
      offBlockTime: formattedToISO(schedule.offBlockTime),
      takeoffTime: formattedToISO(schedule.takeoffTime),
      arrivalTime: formattedToISO(schedule.arrivalTime),
      onBlockTime: formattedToISO(schedule.onBlockTime),
    };

    checkIn(flight.id, normalizedSchedule)
      .then(() => setShowModal(false))
      .catch((error: unknown) => console.error("Failed to check in", error));
  };

  return (
    <section className="rounded-2xl border bg-gray-100 p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex h-full flex-col items-center justify-center">
        <FlightProgressControl flightId={flight.id} status={flight.status} />
        {flight.status === FlightStatus.Ready && (
          <>
            <Button className="mt-2" onClick={() => setShowModal(true)}>
              Go to flight check-in
            </Button>
            {showModal && (
              <CheckInFlightModal
                flight={flight}
                checkIn={handleCheckIn}
                close={() => setShowModal(false)}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
