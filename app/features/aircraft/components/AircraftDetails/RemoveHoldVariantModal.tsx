import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React from "react";
import type { Aircraft } from "~/features/aircraft";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  aircraft: Aircraft;
  defaultVariantId: string | null;
  remove: () => void;
  cancel: () => void;
};

export function RemoveHoldVariantModal({ aircraft, defaultVariantId, remove, cancel }: Props) {
  return (
    <Modal size="sm" className="text-gray-800 dark:text-white" show onClose={cancel}>
      <ModalHeader>
        <ModalTitle context="Cargo hold" action="Remove variant" />
      </ModalHeader>
      <ModalBody>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {aircraft.registration} reverts to the {aircraft.airframe.type} default
          {defaultVariantId !== null && (
            <>
              , <span className="font-mono">{defaultVariantId}</span>
            </>
          )}
          . Load stays planned against a hold.
        </p>
      </ModalBody>
      <ModalActions
        cancel={{ onClick: cancel }}
        confirm={{ label: "Remove variant", tone: "danger", onClick: remove }}
      />
    </Modal>
  );
}
