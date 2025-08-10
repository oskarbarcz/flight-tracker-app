"use client";

import { Button } from "flowbite-react";
import React, { useState } from "react";
import { Loadsheet, describeNextActionStatus } from "~/models";
import UpdateFinalLoadsheetModal from "~/components/Modal/UpdateFinalLoadsheetModal";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";
import { FlightProgressButtonProps } from "~/components/Box/FlightTracking/FlightProgressControl/ChangeFlightProgressButton";

export default function FinishBoardingButton({
  disabled,
}: FlightProgressButtonProps) {
  const { flight, finishBoarding } = useTrackedFlight();
  const [showModal, setShowModal] = useState(false);

  const handleFinishBoarding = async (loadsheet: Loadsheet): Promise<void> => {
    await finishBoarding(loadsheet)
      .then(() => setShowModal(false))
      .catch((error: unknown) =>
        console.error("Failed to finish boarding", error),
      );
  };

  if (!flight) {
    return null;
  }

  return (
    <>
      <Button
        size="xs"
        className="mt-2"
        onClick={() => setShowModal(true)}
        disabled={disabled}
      >
        {describeNextActionStatus(flight.status)}
      </Button>
      {showModal && (
        <UpdateFinalLoadsheetModal
          flight={flight}
          update={handleFinishBoarding}
          cancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}
