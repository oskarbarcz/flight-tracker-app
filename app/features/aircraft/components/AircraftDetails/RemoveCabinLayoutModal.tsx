import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React from "react";
import type { Aircraft } from "~/features/aircraft";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  aircraft: Aircraft;
  remove: () => void;
  cancel: () => void;
};

export function RemoveCabinLayoutModal({ aircraft, remove, cancel }: Props) {
  return (
    <Modal size="sm" className="text-gray-800 dark:text-white" show onClose={cancel}>
      <ModalHeader>
        <ModalTitle context="Cabin layout" action="Remove" />
      </ModalHeader>
      <ModalBody>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {aircraft.registration} will no longer have a cabin. Flights on this aircraft will generate no passenger
          manifest.
        </p>
      </ModalBody>
      <ModalActions
        cancel={{ onClick: cancel }}
        confirm={{ label: "Remove layout", tone: "danger", onClick: remove }}
      />
    </Modal>
  );
}
