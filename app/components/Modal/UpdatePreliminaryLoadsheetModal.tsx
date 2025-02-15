"use client";

import { Flight, Loadsheet } from "~/models";
import { Button, Modal } from "flowbite-react";
import React, { useCallback, useState } from "react";
import UpdateFlightLoadsheetForm from "~/components/Forms/UpdateFlightLoadsheetForm";

type UpdatePreliminaryLoadsheetModalProps = {
  flight: Flight;
  update: (flightId: string, loadsheet: Loadsheet) => void;
  cancel: () => void;
};

export default function UpdatePreliminaryLoadsheetModal({
  flight,
  update,
  cancel,
}: UpdatePreliminaryLoadsheetModalProps) {
  const oldLoadsheet = flight.loadsheets.preliminary;
  const loadsheetTemplate = {
    flightCrew: { pilots: 0, reliefPilots: 0, cabinCrew: 0 },
    passengers: 0,
    zeroFuelWeight: 0,
    cargo: 0,
    payload: 0,
    blockFuel: 0,
  };
  const [newLoadsheet, setNewLoadsheet] = useState<Loadsheet>(
    oldLoadsheet || loadsheetTemplate,
  );

  return (
    <Modal
      size="md"
      className="text-gray-800 dark:text-white"
      show
      onClose={cancel}
    >
      <Modal.Header>Update preliminary loadsheet</Modal.Header>
      <Modal.Body>
        <UpdateFlightLoadsheetForm
          loadsheet={newLoadsheet}
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
            Update loadsheet for flight {flight.flightNumber}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
