"use client";

import { Flight, Loadsheet } from "~/models";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import React, { useCallback, useState } from "react";
import FlightLoadsheetForm from "~/components/Forms/FlightLoadsheetForm";

type UpdateFinalLoadsheetModalProps = {
  flight: Flight;
  update: (loadsheet: Loadsheet) => void;
  cancel: () => void;
};

export default function UpdateFinalLoadsheetModal({
  flight,
  update,
  cancel,
}: UpdateFinalLoadsheetModalProps) {
  const oldLoadsheet = flight.loadsheets.preliminary as Loadsheet;
  const [newLoadsheet, setNewLoadsheet] = useState<Loadsheet>(oldLoadsheet);

  return (
    <Modal
      size="md"
      className="text-gray-800 dark:text-white"
      show
      onClose={cancel}
    >
      <ModalHeader>Fill final loadsheet</ModalHeader>
      <ModalBody>
        <FlightLoadsheetForm
          loadsheet={oldLoadsheet}
          setLoadsheet={useCallback((loadsheet: Loadsheet) => {
            setNewLoadsheet(loadsheet);
          }, [])}
        />
      </ModalBody>
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button color="gray" onClick={cancel}>
            Back
          </Button>
          <Button onClick={() => update(newLoadsheet)}>Finish boarding</Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
