import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
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
      <ModalHeader>Fill final loadsheet</ModalHeader>
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
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button color="gray" outline onClick={cancel}>
            Back
          </Button>
          <Button color="indigo" outline type="submit" form="updateFinalLoadsheetForm">
            Finish boarding
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
