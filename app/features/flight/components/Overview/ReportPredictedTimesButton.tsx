import { Button } from "flowbite-react";
import React, { useState } from "react";
import { HiPencil } from "react-icons/hi";
import { useToast } from "~/app-state/useToast";
import type { FilledSchedule, Flight } from "~/features/flight";
import { ReportPredictedTimesModal } from "~/features/flight/components/Modal/ReportPredictedTimesModal";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";

type Props = {
  flight: Flight;
};

export function ReportPredictedTimesButton({ flight }: Props) {
  const { reportPredictedTimes } = useTrackedFlight();
  const { success, error } = useToast();
  const [showModal, setShowModal] = useState(false);

  const save = async (times: Partial<FilledSchedule>): Promise<void> => {
    await reportPredictedTimes(times)
      .then(() => {
        setShowModal(false);
        success("FMC times saved.");
      })
      .catch((err: unknown) => {
        console.error("Failed to save FMC times", err);
        error("Could not save the FMC times. Try again.");
      });
  };

  return (
    <>
      <Button color="gray" outline size="xs" onClick={() => setShowModal(true)}>
        <HiPencil className="me-1.5" />
        Update from FMC
      </Button>
      {showModal && <ReportPredictedTimesModal flight={flight} save={save} close={() => setShowModal(false)} />}
    </>
  );
}
