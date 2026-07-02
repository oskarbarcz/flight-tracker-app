import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import React, { useState } from "react";
import { useToast } from "~/app-state/useToast";
import type { DelayReport } from "~/features/delay";
import { translateDelayReasonCode } from "~/features/delay/i18n";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";

type Props = {
  report: DelayReport;
  close: () => void;
};

export function RemoveDelayReportConfirmModal({ report, close }: Props) {
  const { removeDelayReport } = useTrackedFlight();
  const { error, success } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleRemove = async () => {
    setSubmitting(true);
    try {
      await removeDelayReport(report.id);
      success("Delay report removed.");
      close();
    } catch (err) {
      const message = (err as { error?: string } | null)?.error ?? "Failed to remove delay report.";
      error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal size="md" className="text-gray-800 dark:text-white" show onClose={close}>
      <ModalHeader>Remove delay report?</ModalHeader>
      <ModalBody>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          This removes the {report.delayMinutes}-minute allocation for{" "}
          <span className="font-semibold">{translateDelayReasonCode(report.reasonCode)}</span>. Those minutes return to
          the unallocated total.
        </p>
      </ModalBody>
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button color="gray" outline onClick={close} disabled={submitting}>
            Back
          </Button>
          <Button color="red" onClick={handleRemove} disabled={submitting}>
            Remove report
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
