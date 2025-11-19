"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import React from "react";
import UpdateFlightScheduleForm from "~/components/flight/Forms/UpdateFlightScheduleForm";
import Form from "~/components/shared/Form/Form";
import { FilledSchedule, Flight } from "~/models";
import { updateScheduleSchema } from "~/validator/form/flight.schema";

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
  return (
    <Modal
      size="sm"
      className="text-gray-800 dark:text-white"
      show
      onClose={cancel}
    >
      <ModalHeader>Update scheduled timesheet</ModalHeader>
      <ModalBody>
        <Form<FilledSchedule>
          id="updateScheduleForm"
          initialValues={flight.timesheet.scheduled}
          validationSchema={updateScheduleSchema}
          onSubmit={(schedule) => update(flight.id, schedule)}
        >
          <UpdateFlightScheduleForm />
        </Form>
      </ModalBody>
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button color="gray" outline onClick={cancel}>
            Back
          </Button>
          <Button
            color="indigo"
            type="submit"
            form="updateScheduleForm"
            outline
          >
            Save changes
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
