"use client";

import { Flight, Loadsheet } from "~/models";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import React from "react";
import UpdateLoadsheetForm from "~/components/flight/Forms/UpdateLoadsheetForm";
import { updatePreliminaryLoadsheetSchema } from "~/validator/form/flight.schema";
import Form from "~/components/shared/Form/Form";
import {
  FlatLoadsheetFormData,
  flatLoadsheetToLoadsheet,
  loadsheetToFlatLoadsheet,
} from "~/validator/form/types/flight.form-types";

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

  const handleSubmit = (loadsheet: FlatLoadsheetFormData) => {
    update(flight.id, flatLoadsheetToLoadsheet(loadsheet));
  };

  return (
    <Modal
      size="md"
      className="text-gray-800 dark:text-white"
      show
      onClose={cancel}
    >
      <ModalHeader>Update preliminary loadsheet</ModalHeader>
      <ModalBody>
        <Form<FlatLoadsheetFormData>
          id="updatePreliminaryLoadsheetForm"
          initialValues={loadsheetToFlatLoadsheet(oldLoadsheet)}
          validationSchema={updatePreliminaryLoadsheetSchema}
          onSubmit={handleSubmit}
        >
          <UpdateLoadsheetForm />
        </Form>
      </ModalBody>
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button color="gray" outline onClick={cancel}>
            Back
          </Button>
          <Button
            type="submit"
            form="updatePreliminaryLoadsheetForm"
            color="indigo"
            outline
          >
            Update loadsheet for flight
            <span className="font-mono font-bold ms-1">
              {flight.flightNumberWithoutSpaces}
            </span>
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
