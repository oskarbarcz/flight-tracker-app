import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React, { useState } from "react";
import { useToast } from "~/app-state/useToast";
import type { DelayReport } from "~/features/delay";
import { translateDelayReasonCode } from "~/features/delay/i18n";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { apiErrorMessage } from "~/shared/lib/handleFormikApiError";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

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
      const message = apiErrorMessage(err, "Failed to remove delay report. Try again.");
      error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal size="md" className="text-gray-800 dark:text-white" show onClose={close}>
      <ModalHeader>
        <ModalTitle context="Delay report" action="Remove" />
      </ModalHeader>
      <ModalBody>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          This removes the {report.delayMinutes}-minute allocation for{" "}
          <span className="font-semibold">{translateDelayReasonCode(report.reasonCode)}</span>. Those minutes return to
          the unallocated total.
        </p>
      </ModalBody>
      <ModalActions
        cancel={{ onClick: close }}
        confirm={{ label: "Remove report", onClick: handleRemove, tone: "danger" }}
        pending={submitting}
      />
    </Modal>
  );
}
