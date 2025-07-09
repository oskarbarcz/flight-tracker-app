"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { RotationResponse } from "~/models";

type RemoveRotationModalProps = {
  rotation: RotationResponse;
  remove: (rotationId: string) => void;
  cancel: () => void;
};

export default function RemoveRotationModal({
  rotation,
  remove,
  cancel,
}: RemoveRotationModalProps) {
  return (
    <Modal show onClose={cancel}>
      <ModalHeader>Remove rotation</ModalHeader>
      <ModalBody className="text-gray-900 dark:text-gray-100">
        <p>
          You are going to remove rotation{" "}
          <span className="font-bold">{rotation.name} </span>
          for <span className="font-bold">{rotation.pilot.name}</span>.
        </p>
        <p>
          <span className="font-bold">This action is unrecoverable.</span> Are
          you sure to proceed?
        </p>
      </ModalBody>
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button color="gray" onClick={cancel}>
            Back
          </Button>
          <Button onClick={() => remove(rotation.id)} color="failure">
            Remove rotation
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
