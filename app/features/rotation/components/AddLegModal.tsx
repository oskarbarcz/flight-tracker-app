import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { Form, Formik } from "formik";
import React from "react";
import type { Airport } from "~/features/airport";
import { LegFormFields } from "~/features/rotation/components/LegFormFields";
import { initLegFormData, type LegFormData } from "~/features/rotation/form";
import { legSchema } from "~/features/rotation/schema";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  airports: Airport[];
  defaultDepartureId: string;
  onAdd: (data: LegFormData) => Promise<boolean>;
  onClose: () => void;
};

export function AddLegModal({ airports, defaultDepartureId, onAdd, onClose }: Props) {
  const submit = async (values: LegFormData) => {
    if (await onAdd(values)) {
      onClose();
    }
  };

  return (
    <Modal show onClose={onClose}>
      <ModalHeader>
        <ModalTitle context="Leg" action="Add" />
      </ModalHeader>
      <Formik<LegFormData>
        initialValues={initLegFormData(defaultDepartureId)}
        validationSchema={legSchema}
        onSubmit={submit}
      >
        <Form>
          <ModalBody>
            <LegFormFields airports={airports} />
          </ModalBody>
          <ModalActions cancel={{ onClick: onClose }} confirm={{ label: "Add leg", type: "submit" }} />
        </Form>
      </Formik>
    </Modal>
  );
}
