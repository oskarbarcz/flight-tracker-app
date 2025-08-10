"use client";

import { Button } from "flowbite-react";
import React, { useState } from "react";
import { describeNextActionStatus, FilledSchedule } from "~/models";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";
import CheckInFlightModal from "~/components/Modal/CheckInFlightModal";
import { FlightProgressButtonProps } from "~/components/Box/FlightTracking/FlightProgressControl/ChangeFlightProgressButton";

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
      <Button size="xs" onClick={() => setShowModal(true)} disabled={disabled}>
        {describeNextActionStatus(flight.status)}
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
