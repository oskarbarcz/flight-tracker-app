"use client";

import { Flight, Loadsheet } from "~/models";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "flowbite-react";
import React, { useCallback, useState } from "react";
import FlightLoadsheetForm from "~/components/Forms/FlightLoadsheetForm";

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
  const oldLoadsheet = flight.loadsheets.preliminary ?? {
    flightCrew: { pilots: 0, reliefPilots: 0, cabinCrew: 0 },
    passengers: 0,
    zeroFuelWeight: 0,
    cargo: 0,
    payload: 0,
    blockFuel: 0,
  };
  const [newLoadsheet, setNewLoadsheet] = useState<Loadsheet>(oldLoadsheet);

  return (
    <Modal
      size="md"
      className="text-gray-800 dark:text-white"
      show
      onClose={cancel}
    >
      <ModalHeader>Update preliminary loadsheet</ModalHeader>
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
          <Button onClick={() => update(flight.id, newLoadsheet)}>
            Update loadsheet for flight {flight.flightNumber}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
