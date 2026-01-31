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
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import Form from "~/components/shared/Form/Form";
import { FilledSchedule, Flight } from "~/models";
import { updateScheduleSchema } from "~/validator/form/flight.schema";

type CheckInFlightModalProps = {
  flight: Flight;
  checkIn: (estimation: FilledSchedule) => void;
  close: () => void;
};

export default function CheckInFlightModal({
  flight,
  checkIn,
  close,
}: CheckInFlightModalProps) {
  const schedule = flight.timesheet.scheduled;

  return (
    <Modal size="xl" show onClose={close}>
      <ModalHeader>Check in for flight</ModalHeader>
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
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button color="gray" outline onClick={close}>
            Back to preview
          </Button>
          <Button type="submit" color="indigo" outline form="checkInFlightForm">
            Check in for flight
            <span className="font-mono font-bold ms-2">
              {flight.flightNumberWithoutSpaces}
            </span>
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
