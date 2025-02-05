"use client";

import React, { useCallback, useState } from "react";
import { FilledSchedule, Flight } from "~/models";
import { formatDate } from "~/functions/time";
import { Button, Modal } from "flowbite-react";
import CheckInFlightForm from "~/components/Forms/CheckInFlightForm";
import { useFlight } from "~/state/hooks/useFlight";

type CheckInFlightModalProps = {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  flight: Flight;
};

export default function CheckInFlightModal({
  openModal,
  setOpenModal,
  flight,
}: CheckInFlightModalProps) {
  const schedule = flight.timesheet.scheduled;
  const { checkIn } = useFlight();
  const [estimation, setEstimation] = useState<FilledSchedule>(schedule);

  const handleCheckIn = () => {
    checkIn(flight.id, estimation)
      .then(() => setOpenModal(false))
      .catch((error: unknown) => console.error("Failed to check in", error));
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Check in for flight</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-4 text-gray-800 dark:text-white md:flex-row">
          <div className="w-full md:w-1/2">
            <h2 className="mb-4 text-xl font-bold">Schedule</h2>
            <div className="mb-3">
              <span className="block text-xs font-bold uppercase">
                Off-block time
              </span>
              <span className="block text-lg text-gray-600 dark:text-gray-400">
                {formatDate(new Date(schedule.offBlockTime))}
              </span>
            </div>
            <div className="mb-3">
              <span className="block text-xs font-bold uppercase">
                Takeoff time
              </span>
              <span className="block text-lg text-gray-600 dark:text-gray-400">
                {formatDate(new Date(schedule.takeoffTime))}
              </span>
            </div>
            <div className="mb-3">
              <span className="block text-xs font-bold uppercase">
                Landing time
              </span>
              <span className="block text-lg text-gray-600 dark:text-gray-400">
                {formatDate(new Date(schedule.arrivalTime))}
              </span>
            </div>
            <div className="mb-3">
              <span className="block text-xs font-bold uppercase">
                On-block time
              </span>
              <span className="block text-lg text-gray-600 dark:text-gray-400">
                {formatDate(new Date(schedule.onBlockTime))}
              </span>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <CheckInFlightForm
              estimation={estimation}
              setEstimation={useCallback((estimation: FilledSchedule) => {
                setEstimation(estimation);
              }, [])}
            />
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <span className="font-bold">Caution!</span>{" "}
          <span>All times must be provided in UTC.</span>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <div className="ms-auto flex gap-2">
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Back to preview
          </Button>
          <Button type="submit" onClick={() => handleCheckIn()}>
            Check in for flight {flight.flightNumber}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
