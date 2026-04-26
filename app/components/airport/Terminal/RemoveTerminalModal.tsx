"use client";

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import React from "react";
import { HiOutlineTrash } from "react-icons/hi";
import type { Terminal } from "~/models";

type Props = {
  terminal: Terminal;
  remove: (terminal: Terminal) => void;
  cancel: () => void;
  isPending?: boolean;
};

export function RemoveTerminalModal({ terminal, remove, cancel, isPending = false }: Props) {
  return (
    <Modal size="md" show onClose={cancel}>
      <ModalHeader>Remove terminal</ModalHeader>
      <ModalBody>
        <p>
          You are going to remove terminal <span className="font-mono font-bold">{terminal.shortName}</span> (
          {terminal.fullName}).
        </p>
        <p className="mt-3">
          <span className="font-bold">This action is unrecoverable.</span> Are you sure to proceed?
        </p>
      </ModalBody>
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button color="gray" outline onClick={cancel} disabled={isPending} className="cursor-pointer">
            Back
          </Button>
          <Button
            onClick={() => remove(terminal)}
            color="red"
            disabled={isPending}
            className="cursor-pointer space-x-1.5"
          >
            <HiOutlineTrash />
            <span>Remove terminal</span>
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
