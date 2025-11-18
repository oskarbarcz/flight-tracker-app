"use client";

import { Button } from "flowbite-react";
import React, { useState } from "react";
import { Loadsheet, translateNextActionStatus } from "~/models";
import UpdateFinalLoadsheetModal from "~/components/flight/Modal/UpdateFinalLoadsheetModal";
import { useTrackedFlight } from "~/state/contexts/global/tracked-flight.context";
import { FlightProgressButtonProps } from "~/components/flight/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";

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
        color="indigo"
        outline
        onClick={() => setShowModal(true)}
        disabled={disabled}
      >
        {translateNextActionStatus(flight.status)}
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
