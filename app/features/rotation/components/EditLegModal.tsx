import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { Form, Formik } from "formik";
import React from "react";
import type { Airport } from "~/features/airport";
import type { RotationLeg } from "~/features/rotation";
import { LegFormFields } from "~/features/rotation/components/LegFormFields";
import { type LegFormData, legToFormData } from "~/features/rotation/form";
import { legSchema } from "~/features/rotation/schema";

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
      <ModalHeader>Edit leg</ModalHeader>
      <Formik<LegFormData> initialValues={legToFormData(leg)} validationSchema={legSchema} onSubmit={submit}>
        <Form>
          <ModalBody>
            <LegFormFields airports={airports} />
          </ModalBody>
          <ModalFooter>
            <div className="ms-auto flex gap-2">
              <Button color="gray" outline onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" color="indigo">
                Save leg
              </Button>
            </div>
          </ModalFooter>
        </Form>
      </Formik>
    </Modal>
  );
}
