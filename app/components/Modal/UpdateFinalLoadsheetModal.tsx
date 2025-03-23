"use client";

import { Flight, Loadsheet } from "~/models";
import { Button, Modal } from "flowbite-react";
import React, { useCallback, useState } from "react";
import FlightLoadsheetForm from "~/components/Forms/FlightLoadsheetForm";

type UpdateFinalLoadsheetModalProps = {
  flight: Flight;
  update: (flightId: string, loadsheet: Loadsheet) => void;
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
      <Modal.Header>Fill final loadsheet</Modal.Header>
      <Modal.Body>
        <FlightLoadsheetForm
          loadsheet={oldLoadsheet}
          setLoadsheet={useCallback((loadsheet: Loadsheet) => {
            setNewLoadsheet(loadsheet);
          }, [])}
        />
      </Modal.Body>
      <Modal.Footer>
        <div className="ms-auto flex gap-2">
          <Button color="gray" onClick={cancel}>
            Back
          </Button>
          <Button onClick={() => update(flight.id, newLoadsheet)}>
            Finish boarding
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
