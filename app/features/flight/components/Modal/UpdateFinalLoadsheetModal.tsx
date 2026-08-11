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

type UpdateFinalLoadsheetModalProps = {
  flight: Flight;
  update: (loadsheet: Loadsheet) => void;
  cancel: () => void;
};

export function UpdateFinalLoadsheetModal({ flight, update, cancel }: UpdateFinalLoadsheetModalProps) {
  const loadsheet = flight.loadsheets.preliminary as Loadsheet;

  const handleSubmit = (loadsheet: FlatLoadsheetFormData) => {
    update(flatLoadsheetToLoadsheet(loadsheet));
  };

  return (
    <Modal size="5xl" className="text-gray-800 dark:text-white" show onClose={cancel}>
      <ModalHeader>
        <ModalTitle context="Loadsheet" action="Fill final" />
      </ModalHeader>
      <ModalBody>
        <Form<FlatLoadsheetFormData>
          id="updateFinalLoadsheetForm"
          initialValues={loadsheetToFlatLoadsheet(loadsheet)}
          validationSchema={updatePreliminaryLoadsheetSchema}
          onSubmit={handleSubmit}
        >
          <UpdateLoadsheetForm />
        </Form>
      </ModalBody>
      <ModalActions
        cancel={{ label: "Back", onClick: cancel }}
        confirm={{ label: "Finish boarding", type: "submit", form: "updateFinalLoadsheetForm" }}
      />
    </Modal>
  );
}
