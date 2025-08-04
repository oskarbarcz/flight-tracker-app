"use client";

import { FilledSchedule, FlightStatus } from "~/models";
import FlightProgressControl from "~/components/FlightProgressControl/FlightProgressControl";
import React, { useState } from "react";
import { Button } from "flowbite-react";
import CheckInFlightModal from "~/components/Modal/CheckInFlightModal";
import { formattedToISO } from "~/functions/time";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";

export function FlightPhaseBox() {
  const { flight } = useTrackedFlight();
  const [showModal, setShowModal] = useState(false);
  const { checkIn } = useTrackedFlight();

  const handleCheckIn = (schedule: FilledSchedule) => {
    const normalizedSchedule = {
      offBlockTime: formattedToISO(schedule.offBlockTime),
      takeoffTime: formattedToISO(schedule.takeoffTime),
      arrivalTime: formattedToISO(schedule.arrivalTime),
      onBlockTime: formattedToISO(schedule.onBlockTime),
    };

    checkIn(normalizedSchedule)
      .then(() => setShowModal(false))
      .catch((error: unknown) => console.error("Failed to check in", error));
  };

  if (!flight) {
    return null;
  }

  return (
    <section className="rounded-2xl p-6">
      <div className="flex h-full flex-col items-center justify-center">
        <FlightProgressControl />
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
