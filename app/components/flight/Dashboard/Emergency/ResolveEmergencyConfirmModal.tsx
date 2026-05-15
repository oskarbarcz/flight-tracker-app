"use client";

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import React, { useState } from "react";
import type { Emergency } from "~/models";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";
import { useToast } from "~/state/app/context/useToast";

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
      <ModalHeader>Resolve emergency?</ModalHeader>
      <ModalBody>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          This stops the active emergency on the flight. The record stays in history with the time and your name
          attached, but it cannot be edited afterwards.
        </p>
      </ModalBody>
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button color="gray" outline onClick={close} disabled={submitting}>
            Back
          </Button>
          <Button color="red" onClick={handleResolve} disabled={submitting}>
            Mark resolved
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
