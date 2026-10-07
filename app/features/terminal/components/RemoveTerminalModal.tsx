import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React from "react";
import { HiOutlineTrash } from "react-icons/hi";
import type { Terminal } from "~/features/terminal";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  terminal: Terminal;
  remove: (terminal: Terminal) => void;
  cancel: () => void;
  isPending?: boolean;
};

export function RemoveTerminalModal({ terminal, remove, cancel, isPending = false }: Props) {
  return (
    <Modal size="md" show onClose={cancel}>
      <ModalHeader>
        <ModalTitle context="Terminal" action="Remove" />
      </ModalHeader>
      <ModalBody>
        <p>
          Remove terminal <span className="font-mono font-bold">{terminal.shortName}</span> ({terminal.fullName})?
        </p>
        <p className="mt-3">This cannot be undone.</p>
      </ModalBody>
      <ModalActions
        cancel={{ onClick: cancel }}
        confirm={{
          label: "Remove terminal",
          onClick: () => remove(terminal),
          tone: "danger",
          icon: HiOutlineTrash,
        }}
        pending={isPending}
      />
    </Modal>
  );
}
