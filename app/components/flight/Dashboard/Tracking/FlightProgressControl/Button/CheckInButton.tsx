"use client";

import { Button } from "flowbite-react";
import React, { useState } from "react";
import type { FlightProgressButtonProps } from "~/components/flight/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import { CheckInFlightModal } from "~/components/flight/Modal/CheckInFlightModal";
import { toHuman } from "~/i18n/translate";
import type { FilledSchedule } from "~/models";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";

export function CheckInButton({ disabled }: FlightProgressButtonProps) {
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
      <Button color="indigo" outline onClick={() => setShowModal(true)} disabled={disabled}>
        {toHuman.flight.status.next(flight.status)}
      </Button>
      {showModal && <CheckInFlightModal flight={flight} checkIn={handleCheckIn} close={() => setShowModal(false)} />}
    </>
  );
}
