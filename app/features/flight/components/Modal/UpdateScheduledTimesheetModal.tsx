import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React from "react";
import type { FilledSchedule, Flight } from "~/features/flight";
import { UpdateFlightScheduleForm } from "~/features/flight/components/Forms/UpdateFlightScheduleForm";
import { updateScheduleSchema } from "~/features/flight/schema";
import { Form } from "~/shared/ui/Form/Form";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  flight: Flight;
  update: (flightId: string, schedule: FilledSchedule) => void;
  cancel: () => void;
};

export function UpdateScheduledTimesheetModal({ flight, update, cancel }: Props) {
  return (
    <Modal size="sm" className="text-gray-800 dark:text-white" show onClose={cancel}>
      <ModalHeader>
        <ModalTitle context="Timesheet" action="Update scheduled" />
      </ModalHeader>
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
      <ModalActions
        cancel={{ label: "Back", onClick: cancel }}
        confirm={{ label: "Save changes", type: "submit", form: "updateScheduleForm" }}
      />
    </Modal>
  );
}
