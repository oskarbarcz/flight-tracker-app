import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React from "react";
import type { FilledSchedule, Flight } from "~/features/flight";
import { UpdateFlightScheduleForm } from "~/features/flight/components/Forms/UpdateFlightScheduleForm";
import { updateScheduleSchema } from "~/features/flight/schema";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { Form } from "~/shared/ui/Form/Form";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  flight: Flight;
  checkIn: (estimation: FilledSchedule) => void;
  close: () => void;
};

export function CheckInFlightModal({ flight, checkIn, close }: Props) {
  const schedule = flight.timesheet.scheduled;

  return (
    <Modal size="xl" show onClose={close}>
      <ModalHeader>
        <ModalTitle context="Flight" action="Check in" />
      </ModalHeader>
      <ModalBody>
        <h2 className="mb-3 text-xl font-bold">Schedule</h2>
        <div className="space-x-4 text-center font-mono">
          <div className="inline-block">
            <p className="text-xs text-gray-500">DEP DATE</p>
            <p className="font-bold">
              <FormattedIcaoDate date={schedule.offBlockTime} />
            </p>
          </div>
          <div className="inline-block">
            <p className="text-xs text-gray-500">OFF</p>
            <p className="font-bold">
              <FormattedIcaoTime date={schedule.offBlockTime} />
            </p>
          </div>
          <div className="inline-block">
            <p className="text-xs text-gray-500">OUT</p>
            <p className="font-bold">
              <FormattedIcaoTime date={schedule.takeoffTime} />
            </p>
          </div>
          <div className="inline-block">
            <p className="text-xs text-gray-500">IN</p>
            <p className="font-bold">
              <FormattedIcaoTime date={schedule.arrivalTime} />
            </p>
          </div>
          <div className="inline-block">
            <p className="text-xs text-gray-500">ON</p>
            <p className="font-bold">
              <FormattedIcaoTime date={schedule.onBlockTime} />
            </p>
          </div>
        </div>
        <h2 className="my-4 text-xl font-bold">Estimation</h2>
        <Form<FilledSchedule>
          id="checkInFlightForm"
          initialValues={schedule}
          validationSchema={updateScheduleSchema}
          onSubmit={(schedule) => checkIn(schedule)}
        >
          <UpdateFlightScheduleForm />
        </Form>
      </ModalBody>
      <ModalActions
        cancel={{ label: "Back to preview", onClick: close }}
        confirm={{
          label: "Check in for flight",
          type: "submit",
          form: "checkInFlightForm",
          trailing: <span className="font-mono font-bold">{flight.flightNumberWithoutSpaces}</span>,
        }}
      />
    </Modal>
  );
}
