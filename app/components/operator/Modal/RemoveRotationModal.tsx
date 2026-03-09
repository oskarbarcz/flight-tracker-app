"use client";

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import type { GetRotationResponse } from "~/state/api/request/operator.request";

type Props = {
  rotation: GetRotationResponse;
  remove: (rotationId: string) => void;
  cancel: () => void;
};

export function RemoveRotationModal({ rotation, remove, cancel }: Props) {
  return (
    <Modal size="md" show onClose={cancel}>
      <ModalHeader>Remove rotation</ModalHeader>
      <ModalBody>
        <p>
          You are going to remove rotation <span className="font-bold">{rotation.name}</span>.
        </p>
        <p className="mt-3">
          <span className="font-bold">This action is unrecoverable.</span> Are you sure to proceed?
        </p>
      </ModalBody>
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button color="gray" outline onClick={cancel} className="cursor-pointer">
            Back
          </Button>
          <Button onClick={() => remove(rotation.id)} color="red" className="cursor-pointer">
            Remove rotation
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
