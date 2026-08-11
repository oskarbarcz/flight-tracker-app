import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React from "react";
import { HiOutlineTrash } from "react-icons/hi";
import type { Gate } from "~/features/gate";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  gate: Gate;
  remove: (gate: Gate) => void;
  cancel: () => void;
  isPending?: boolean;
};

export function RemoveGateModal({ gate, remove, cancel, isPending = false }: Props) {
  return (
    <Modal size="md" show onClose={cancel}>
      <ModalHeader>
        <ModalTitle context="Gate" action="Remove" />
      </ModalHeader>
      <ModalBody>
        <p>
          You are going to remove gate <span className="font-mono font-bold">{gate.name}</span>.
        </p>
        <p className="mt-3">
          <span className="font-bold">This action is unrecoverable.</span> Are you sure to proceed?
        </p>
      </ModalBody>
      <ModalActions
        cancel={{ label: "Back", onClick: cancel }}
        confirm={{
          label: "Remove gate",
          onClick: () => remove(gate),
          tone: "danger",
          icon: HiOutlineTrash,
        }}
        pending={isPending}
      />
    </Modal>
  );
}
