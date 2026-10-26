import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React, { useState } from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { LuTriangleAlert } from "react-icons/lu";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { nextStatus } from "~/features/flight/lib/flightPhase";
import { toHuman } from "~/i18n/translate";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  action: string;
  note?: string;
  report: () => Promise<void>;
  failureMessage: string;
  close: () => void;
};

export function ConfirmFlightProgressModal({ action, note, report, failureMessage, close }: Props) {
  const { flight } = useTrackedFlight();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!flight) {
    return null;
  }

  const next = nextStatus(flight.status);

  const confirm = async () => {
    setPending(true);
    setFailed(false);

    try {
      await report();
      close();
    } catch (err: unknown) {
      console.error(failureMessage, err);
      setFailed(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <Modal size="md" className="text-gray-800 dark:text-white" show onClose={pending ? undefined : close}>
      <ModalHeader>
        <ModalTitle context="Flight" action={action} />
      </ModalHeader>
      <ModalBody>
        <div className="space-y-3 text-pretty text-sm text-gray-600 dark:text-gray-400">
          {next !== null && (
            <p>
              {flight.flightNumber} moves to{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {toHuman.flight.status.standard(next, flight.serviceType)}
              </span>
              . The time is recorded when you confirm.
            </p>
          )}
          {note && (
            <p className="flex items-start gap-2 text-amber-700 dark:text-amber-400">
              <LuTriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden={true} />
              <span>{note}</span>
            </p>
          )}
          {failed && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-red-700 dark:border-red-900 dark:bg-red-900/40 dark:text-red-300"
            >
              <FaCircleExclamation aria-hidden={true} className="mt-0.5 shrink-0" />
              <span>{failureMessage}</span>
            </p>
          )}
        </div>
      </ModalBody>
      <ModalActions
        cancel={{ onClick: close }}
        confirm={{ label: action, onClick: confirm }}
        pending={pending}
        pendingLabel="Sending…"
      />
    </Modal>
  );
}
