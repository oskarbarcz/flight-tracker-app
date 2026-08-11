import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React, { useState } from "react";
import { useToast } from "~/app-state/useToast";
import type { Emergency } from "~/features/emergency";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  emergency: Emergency;
  close: () => void;
};

export function ResolveEmergencyConfirmModal({ emergency, close }: Props) {
  const { resolveEmergency } = useTrackedFlight();
  const { error, success } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleResolve = async () => {
    setSubmitting(true);
    try {
      await resolveEmergency(emergency.id);
      success("Emergency marked as resolved.");
      close();
    } catch (err) {
      const message = (err as { error?: string } | null)?.error ?? "Failed to resolve emergency.";
      error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal size="md" className="text-gray-800 dark:text-white" show onClose={close}>
      <ModalHeader>
        <ModalTitle context="Emergency" action="Resolve" />
      </ModalHeader>
      <ModalBody>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          This stops the active emergency on the flight. The record stays in history with the time and your name
          attached, but it cannot be edited afterwards.
        </p>
      </ModalBody>
      <ModalActions
        cancel={{ label: "Back", onClick: close }}
        confirm={{ label: "Mark resolved", onClick: handleResolve, tone: "danger" }}
        pending={submitting}
      />
    </Modal>
  );
}
