"use client";

import { Button } from "flowbite-react";
import React, { useState } from "react";
import { Loadsheet } from "~/models";
import UpdateFinalLoadsheetModal from "~/components/Modal/UpdateFinalLoadsheetModal";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";

export default function FinishBoardingButton() {
  const { flight, finishBoarding } = useTrackedFlight();
  const [showModal, setShowModal] = useState(false);

  const handleFinishBoarding = async (loadsheet: Loadsheet): Promise<void> => {
    await finishBoarding(loadsheet)
      .then(() => setShowModal(false))
      .catch((error: unknown) => console.error("Failed to check in", error));
  };

  if (!flight) {
    return null;
  }

  return (
    <>
      <Button className="mt-2" onClick={() => setShowModal(true)}>
        Fill final loadsheet and finish boarding
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
