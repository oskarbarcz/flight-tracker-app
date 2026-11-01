import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React, { useState } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import type { FilledSchedule, Flight } from "~/features/flight";
import { BlockTimeRows } from "~/features/flight/components/Forms/BlockTimeRows";
import { changedBlockTimes, currentBlockTimes, reportableEvents } from "~/features/flight/lib/predictedTimes";
import { updateScheduleSchema } from "~/features/flight/schema";
import { Form } from "~/shared/ui/Form/Form";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  flight: Flight;
  save: (times: Partial<FilledSchedule>) => Promise<void>;
  close: () => void;
};

export function ReportPredictedTimesModal({ flight, save, close }: Props) {
  const [pending, setPending] = useState(false);
  const current = currentBlockTimes(flight.timesheet);

  const submit = async (entered: FilledSchedule) => {
    const changed = changedBlockTimes(flight.status, current, entered);

    if (Object.keys(changed).length === 0) {
      close();
      return;
    }

    setPending(true);

    try {
      await save(changed);
    } finally {
      setPending(false);
    }
  };

  return (
    <Modal size="xl" className="text-gray-800 dark:text-white" show onClose={pending ? undefined : close}>
      <ModalHeader>
        <ModalTitle context="FMC times" action="Update" />
      </ModalHeader>
      <ModalBody>
        <p className="mb-5 flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2.5 text-pretty text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          <FaCircleInfo aria-hidden className="mt-0.5 shrink-0" />
          <span>
            Enter the times your FMC shows, or the ones ATC gave you. They replace your estimates until each event is
            reported.
          </span>
        </p>
        <Form<FilledSchedule>
          id="reportPredictedTimesForm"
          initialValues={current}
          validationSchema={updateScheduleSchema}
          onSubmit={submit}
        >
          <div className="@container">
            <BlockTimeRows
              scheduled={flight.timesheet.scheduled}
              kind="Predicted"
              events={reportableEvents(flight.status)}
            />
          </div>
        </Form>
      </ModalBody>
      <ModalActions
        cancel={{ onClick: close }}
        confirm={{ label: "Save times", type: "submit", form: "reportPredictedTimesForm" }}
        pending={pending}
        pendingLabel="Saving…"
      />
    </Modal>
  );
}
