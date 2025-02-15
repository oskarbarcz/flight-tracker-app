"use client";

import { FilledSchedule, Flight } from "~/models";
import { Button, Modal } from "flowbite-react";
import React, { useCallback, useState } from "react";
import UpdateFlightScheduleForm from "~/components/Forms/UpdateFlightScheduleForm";

type UpdateFlightScheduledTimesheetModalProps = {
  flight: Flight;
  update: (flightId: string, schedule: FilledSchedule) => void;
  cancel: () => void;
};

export default function UpdateScheduledTimesheetModal({
  flight,
  update,
  cancel,
}: UpdateFlightScheduledTimesheetModalProps) {
  const oldSchedule = flight.timesheet.scheduled;
  const [newSchedule, setNewSchedule] = useState<FilledSchedule>(oldSchedule);

  return (
    <Modal
      size="md"
      className="text-gray-800 dark:text-white"
      show
      onClose={cancel}
    >
      <Modal.Header>Update scheduled timesheet</Modal.Header>
      <Modal.Body>
        <UpdateFlightScheduleForm
          schedule={oldSchedule}
          setSchedule={useCallback((estimation: FilledSchedule) => {
            setNewSchedule(estimation);
          }, [])}
        />
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
