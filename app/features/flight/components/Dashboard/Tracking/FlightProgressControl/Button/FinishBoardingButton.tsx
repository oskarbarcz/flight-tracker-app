import { Button } from "flowbite-react";
import React, { useState } from "react";
import { useToast } from "~/app-state/useToast";
import { FlightServiceType, type Loadsheet } from "~/features/flight";
import type { FlightProgressButtonProps } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import { UpdateFinalLoadsheetModal } from "~/features/flight/components/Modal/UpdateFinalLoadsheetModal";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { capacityRefusal, describeCapacityRefusal } from "~/features/flight/lib/capacityRefusal";
import { toHuman } from "~/i18n/translate";

export function FinishBoardingButton({ disabled }: FlightProgressButtonProps) {
  const { flight, finishBoarding } = useTrackedFlight();
  const { error } = useToast();
  const [showModal, setShowModal] = useState(false);
  const handlingNoun = flight?.serviceType === FlightServiceType.Cargo ? "loading" : "boarding";

  const handleFinishBoarding = async (loadsheet: Loadsheet): Promise<void> => {
    await finishBoarding(loadsheet)
      .then(() => setShowModal(false))
      .catch((err: unknown) => {
        const refusal = capacityRefusal(err);

        if (refusal === null) {
          console.error("Failed to finish boarding", err);
          error(`Could not finish ${handlingNoun}. Please try again.`);
          return;
        }

        error(describeCapacityRefusal(refusal, flight?.aircraft.cabinLayout?.id ?? null));
      });
  };

  if (!flight) {
    return null;
  }

  return (
    <>
      <Button color="indigo" outline onClick={() => setShowModal(true)} disabled={disabled}>
        {toHuman.flight.status.next(flight.status, flight.serviceType)}
      </Button>
      {showModal && (
        <UpdateFinalLoadsheetModal flight={flight} update={handleFinishBoarding} cancel={() => setShowModal(false)} />
      )}
    </>
  );
}
