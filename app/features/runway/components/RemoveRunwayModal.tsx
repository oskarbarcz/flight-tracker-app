import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React from "react";
import { HiOutlineTrash } from "react-icons/hi";
import type { Runway } from "~/features/runway";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  runway: Runway;
  remove: (runway: Runway) => void;
  cancel: () => void;
  isPending?: boolean;
};

export function RemoveRunwayModal({ runway, remove, cancel, isPending = false }: Props) {
  return (
    <Modal size="md" show onClose={cancel}>
      <ModalHeader>
        <ModalTitle context="Runway" action="Remove" />
      </ModalHeader>
      <ModalBody>
        <p>
          You are going to remove runway <span className="font-mono font-bold">{runway.designator}</span>.
        </p>
        <p className="mt-3">
          <span className="font-bold">This action is unrecoverable.</span> Are you sure to proceed?
        </p>
      </ModalBody>
      <ModalActions
        cancel={{ label: "Back", onClick: cancel }}
        confirm={{
          label: "Remove runway",
          onClick: () => remove(runway),
          tone: "danger",
          icon: HiOutlineTrash,
        }}
        pending={isPending}
      />
    </Modal>
  );
}
