import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React from "react";
import type { Flight, Loadsheet } from "~/features/flight";
import { UpdateLoadsheetForm } from "~/features/flight/components/Forms/UpdateLoadsheetForm";
import {
  type FlatLoadsheetFormData,
  flatLoadsheetToLoadsheet,
  loadsheetToFlatLoadsheet,
} from "~/features/flight/form-types";
import { updatePreliminaryLoadsheetSchema } from "~/features/flight/schema";
import { Form } from "~/shared/ui/Form/Form";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  flight: Flight;
  update: (flightId: string, loadsheet: Loadsheet) => void;
  cancel: () => void;
};

export function UpdatePreliminaryLoadsheetModal({ flight, update, cancel }: Props) {
  const oldLoadsheet = flight.loadsheets.preliminary ?? {
    flightCrew: { pilots: 0, reliefPilots: 0, cabinCrew: 0 },
    passengers: 0,
    zeroFuelWeight: 0,
    cargo: 0,
    payload: 0,
    blockFuel: 0,
    fuel: null,
  };

  const handleSubmit = (loadsheet: FlatLoadsheetFormData) => {
    update(flight.id, flatLoadsheetToLoadsheet(loadsheet));
  };

  return (
    <Modal size="5xl" className="text-gray-800 dark:text-white" show onClose={cancel}>
      <ModalHeader>
        <ModalTitle context="Loadsheet" action="Update preliminary" />
      </ModalHeader>
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
      <ModalActions
        cancel={{ label: "Back", onClick: cancel }}
        confirm={{
          label: "Update loadsheet for flight",
          type: "submit",
          form: "updatePreliminaryLoadsheetForm",
          trailing: <span className="font-mono font-bold">{flight.flightNumberWithoutSpaces}</span>,
        }}
      />
    </Modal>
  );
}
