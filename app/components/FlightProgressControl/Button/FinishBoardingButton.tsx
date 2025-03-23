"use client";

import { Button } from "flowbite-react";
import { useFlight } from "~/state/hooks/useFlight";
import React, { useState } from "react";
import { Flight, Loadsheet } from "~/models";
import UpdateFinalLoadsheetModal from "~/components/Modal/UpdateFinalLoadsheetModal";

type FinishBoardingButtonProps = {
  flight: Flight;
};

export default function FinishBoardingButton({
  flight,
}: FinishBoardingButtonProps) {
  const { finishBoarding } = useFlight();
  const [showModal, setShowModal] = useState(false);

  const handleFinishBoarding = async (
    flightId: string,
    loadsheet: Loadsheet,
  ) => {
    await finishBoarding(flightId, loadsheet)
      .then(() => setShowModal(false))
      .catch((error: unknown) => console.error("Failed to check in", error));
  };

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
