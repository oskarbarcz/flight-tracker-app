import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { Form, Formik } from "formik";
import React from "react";
import type { Airport } from "~/features/airport";
import { LegFormFields } from "~/features/rotation/components/LegFormFields";
import { initLegFormData, type LegFormData } from "~/features/rotation/form";
import { legSchema } from "~/features/rotation/schema";

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
      <ModalHeader>Add leg</ModalHeader>
      <Formik<LegFormData>
        initialValues={initLegFormData(defaultDepartureId)}
        validationSchema={legSchema}
        onSubmit={submit}
      >
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
                Add leg
              </Button>
            </div>
          </ModalFooter>
        </Form>
      </Formik>
    </Modal>
  );
}
