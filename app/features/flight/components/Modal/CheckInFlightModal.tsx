import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React, { useState } from "react";
import { FaTriangleExclamation } from "react-icons/fa6";
import type { FilledSchedule, Flight } from "~/features/flight";
import { NoticePanel } from "~/features/flight/components/Dashboard/Tracking/Progress/NoticePanel";
import { CheckInScheduleForm } from "~/features/flight/components/Forms/CheckInScheduleForm";
import { updateScheduleSchema } from "~/features/flight/schema";
import { Form } from "~/shared/ui/Form/Form";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  flight: Flight;
  checkIn: (estimation: FilledSchedule) => Promise<void>;
  close: () => void;
};

export function CheckInFlightModal({ flight, checkIn, close }: Props) {
  const schedule = flight.timesheet.scheduled;
  const [pending, setPending] = useState(false);

  const submit = async (estimation: FilledSchedule) => {
    setPending(true);

    try {
      await checkIn(estimation);
    } finally {
      setPending(false);
    }
  };

  return (
    <Modal size="xl" className="text-gray-800 dark:text-white" show onClose={pending ? undefined : close}>
      <ModalHeader>
        <ModalTitle context="Flight" action="Check in" />
      </ModalHeader>
      <ModalBody>
        <p className="mb-5 text-pretty text-sm text-gray-600 dark:text-gray-400">
          Enter the times visible on the “estimated” section of your operational flight plan.
        </p>
        {flight.departureParkingPositionId === null && (
          <div className="mb-5">
            <NoticePanel
              tone="warning"
              icon={FaTriangleExclamation}
              title="No departure stand set"
              description="You can check in without one, but the stand can’t be set or changed after check‑in. To choose one first, cancel and use Set parking stand in the Travel plan card."
            />
          </div>
        )}
        <Form<FilledSchedule>
          id="checkInFlightForm"
          initialValues={schedule}
          validationSchema={updateScheduleSchema}
          onSubmit={submit}
        >
          <CheckInScheduleForm scheduled={schedule} />
        </Form>
      </ModalBody>
      <ModalActions
        cancel={{ onClick: close }}
        confirm={{
          label: "Check in",
          type: "submit",
          form: "checkInFlightForm",
          trailing: <span className="font-mono font-bold">{flight.flightNumberWithoutSpaces}</span>,
        }}
        pending={pending}
        pendingLabel="Checking in…"
      />
    </Modal>
  );
}
