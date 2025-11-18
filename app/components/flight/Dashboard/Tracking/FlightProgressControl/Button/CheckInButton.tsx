"use client";

import { Button } from "flowbite-react";
import React, { useState } from "react";
import { FlightProgressButtonProps } from "~/components/flight/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import CheckInFlightModal from "~/components/flight/Modal/CheckInFlightModal";
import { FilledSchedule, translateNextActionStatus } from "~/models";
import { useTrackedFlight } from "~/state/contexts/global/tracked-flight.context";

export default function CheckInButton({ disabled }: FlightProgressButtonProps) {
  const { flight, checkIn } = useTrackedFlight();
  const [showModal, setShowModal] = useState(false);

  const handleCheckIn = async (timesheet: FilledSchedule): Promise<void> => {
    await checkIn(timesheet)
      .then(() => setShowModal(false))
      .catch((error: unknown) => console.error("Failed to check in", error));
  };

  if (!flight) {
    return null;
  }

  return (
    <>
      <Button
        color="indigo"
        outline
        onClick={() => setShowModal(true)}
        disabled={disabled}
      >
        {translateNextActionStatus(flight.status)}
      </Button>
      {showModal && (
        <CheckInFlightModal
          flight={flight}
          checkIn={handleCheckIn}
          close={() => setShowModal(false)}
        />
      )}
    </>
  );
}
