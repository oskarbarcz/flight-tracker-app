import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { Form, Formik } from "formik";
import React from "react";
import type { Airport } from "~/features/airport";
import type { RotationLeg } from "~/features/rotation";
import { LegFormFields } from "~/features/rotation/components/LegFormFields";
import { type LegFormData, legToFormData } from "~/features/rotation/form";
import { legSchema } from "~/features/rotation/schema";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  leg: RotationLeg;
  airports: Airport[];
  onSave: (data: LegFormData) => Promise<boolean>;
  onClose: () => void;
};

export function EditLegModal({ leg, airports, onSave, onClose }: Props) {
  const submit = async (values: LegFormData) => {
    const saved = await onSave(values);
    if (saved) {
      onClose();
    }
  };

  return (
    <Modal show onClose={onClose}>
      <ModalHeader>
        <ModalTitle context="Leg" action="Edit" />
      </ModalHeader>
      <Formik<LegFormData> initialValues={legToFormData(leg)} validationSchema={legSchema} onSubmit={submit}>
        <Form className="flex min-h-0 flex-1 flex-col">
          <ModalBody>
            <LegFormFields airports={airports} />
          </ModalBody>
          <ModalActions cancel={{ onClick: onClose }} confirm={{ label: "Save leg", type: "submit" }} />
        </Form>
      </Formik>
    </Modal>
  );
}
