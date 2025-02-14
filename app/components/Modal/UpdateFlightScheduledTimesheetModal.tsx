"use client";

import { FilledSchedule, Flight } from "~/models";
import { Button, Modal } from "flowbite-react";
import { formatDate } from "~/functions/time";
import React, { useCallback, useState } from "react";
import UpdateFlightScheduleForm from "~/components/Forms/UpdateFlightScheduleForm";

type UpdateFlightScheduledTimesheetModalProps = {
  flight: Flight;
  update: (flightId: string, schedule: FilledSchedule) => void;
  cancel: () => void;
};

export default function UpdateFlightScheduledTimesheetModal({
  flight,
  update,
  cancel,
}: UpdateFlightScheduledTimesheetModalProps) {
  const oldSchedule = flight.timesheet.scheduled;
  const [newSchedule, setNewSchedule] = useState<FilledSchedule>(oldSchedule);

  return (
    <Modal show onClose={cancel}>
      <Modal.Header>Update flight schedule</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-4 text-gray-800 dark:text-white md:flex-row">
          <div className="w-full md:w-1/2">
            <h2 className="mb-4 text-xl font-bold">Current schedule</h2>
            <div className="mb-3">
              <span className="block text-xs font-bold uppercase">
                Off-block time
              </span>
              <span className="block text-lg text-gray-600 dark:text-gray-400">
                {formatDate(new Date(oldSchedule.offBlockTime))}
              </span>
            </div>
            <div className="mb-3">
              <span className="block text-xs font-bold uppercase">
                Takeoff time
              </span>
              <span className="block text-lg text-gray-600 dark:text-gray-400">
                {formatDate(new Date(oldSchedule.takeoffTime))}
              </span>
            </div>
            <div className="mb-3">
              <span className="block text-xs font-bold uppercase">
                Landing time
              </span>
              <span className="block text-lg text-gray-600 dark:text-gray-400">
                {formatDate(new Date(oldSchedule.arrivalTime))}
              </span>
            </div>
            <div className="mb-3">
              <span className="block text-xs font-bold uppercase">
                On-block time
              </span>
              <span className="block text-lg text-gray-600 dark:text-gray-400">
                {formatDate(new Date(oldSchedule.onBlockTime))}
              </span>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <UpdateFlightScheduleForm
              schedule={oldSchedule}
              setSchedule={useCallback((estimation: FilledSchedule) => {
                setNewSchedule(estimation);
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
          <Button color="gray" onClick={cancel}>
            Back
          </Button>
          <Button onClick={() => update(flight.id, newSchedule)}>
            Update schedule for flight {flight.flightNumber}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
