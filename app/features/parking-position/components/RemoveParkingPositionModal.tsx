import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React from "react";
import { HiOutlineTrash } from "react-icons/hi";
import type { ParkingPosition } from "~/features/parking-position";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  parkingPosition: ParkingPosition;
  remove: (parkingPosition: ParkingPosition) => void;
  cancel: () => void;
  isPending?: boolean;
};

export function RemoveParkingPositionModal({ parkingPosition, remove, cancel, isPending = false }: Props) {
  return (
    <Modal size="md" show onClose={cancel}>
      <ModalHeader>
        <ModalTitle context="Parking stand" action="Remove" />
      </ModalHeader>
      <ModalBody>
        <p>
          You are going to remove parking stand <span className="font-mono font-bold">{parkingPosition.name}</span>.
        </p>
        <p className="mt-3">
          <span className="font-bold">This action is unrecoverable.</span> Are you sure to proceed?
        </p>
      </ModalBody>
      <ModalActions
        cancel={{ label: "Back", onClick: cancel }}
        confirm={{
          label: "Remove parking stand",
          onClick: () => remove(parkingPosition),
          tone: "danger",
          icon: HiOutlineTrash,
        }}
        pending={isPending}
      />
    </Modal>
  );
}
