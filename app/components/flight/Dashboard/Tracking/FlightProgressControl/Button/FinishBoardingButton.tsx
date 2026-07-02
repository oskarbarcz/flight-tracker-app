import { Button } from "flowbite-react";
import React, { useState } from "react";
import { useToast } from "~/app-state/useToast";
import type { FlightProgressButtonProps } from "~/components/flight/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import { UpdateFinalLoadsheetModal } from "~/components/flight/Modal/UpdateFinalLoadsheetModal";
import { toHuman } from "~/i18n/translate";
import type { Loadsheet } from "~/models";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";

export function FinishBoardingButton({ disabled }: FlightProgressButtonProps) {
  const { flight, finishBoarding } = useTrackedFlight();
  const { error } = useToast();
  const [showModal, setShowModal] = useState(false);

  const handleFinishBoarding = async (loadsheet: Loadsheet): Promise<void> => {
    await finishBoarding(loadsheet)
      .then(() => setShowModal(false))
      .catch((err: unknown) => {
        console.error("Failed to finish boarding", err);
        error("Could not finish boarding. Please try again.");
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
      {showModal && (
        <UpdateFinalLoadsheetModal flight={flight} update={handleFinishBoarding} cancel={() => setShowModal(false)} />
      )}
    </>
  );
}
