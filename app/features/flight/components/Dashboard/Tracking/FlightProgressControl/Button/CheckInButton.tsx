import { Button } from "flowbite-react";
import React, { useState } from "react";
import { useToast } from "~/app-state/useToast";
import type { FilledSchedule } from "~/features/flight";
import type { FlightProgressButtonProps } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import { CheckInFlightModal } from "~/features/flight/components/Modal/CheckInFlightModal";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { toHuman } from "~/i18n/translate";

export function CheckInButton({ disabled }: FlightProgressButtonProps) {
  const { flight, checkIn } = useTrackedFlight();
  const { error } = useToast();
  const [showModal, setShowModal] = useState(false);

  const handleCheckIn = async (timesheet: FilledSchedule): Promise<void> => {
    await checkIn(timesheet)
      .then(() => setShowModal(false))
      .catch((err: unknown) => {
        console.error("Failed to check in", err);
        error("Could not check in. Please try again.");
      });
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
