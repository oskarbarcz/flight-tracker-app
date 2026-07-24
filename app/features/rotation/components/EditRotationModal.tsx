import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { Form, Formik } from "formik";
import React from "react";
import { PilotLicenseInputBlock } from "~/features/rotation/components/PilotLicenseInputBlock";
import { RotationTmi } from "~/features/rotation/components/RotationTmi";
import type { CreateRotationRequest } from "~/features/rotation/request";
import { createRotationSchema } from "~/features/rotation/schema";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";

type Props = {
  name: string;
  pilotId: string;
  onSave: (data: CreateRotationRequest) => Promise<boolean>;
  onClose: () => void;
};

export function EditRotationModal({ name, pilotId, onSave, onClose }: Props) {
  const submit = async (values: CreateRotationRequest) => {
    if (await onSave(values)) {
      onClose();
    }
  };

  return (
    <Modal show size="lg" onClose={onClose}>
      <ModalHeader>Edit rotation</ModalHeader>
      <Formik<CreateRotationRequest>
        initialValues={{ name, pilotId }}
        validationSchema={createRotationSchema}
        onSubmit={submit}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form>
            <ModalBody className="flex flex-col gap-4">
              <RotationTmi />
              <ManagedFloatingInputBlock field="name" label="Rotation name" />
              <PilotLicenseInputBlock
                htmlName="pilotId"
                label="Assigned pilot"
                defaultValue={pilotId}
                setFieldValue={setFieldValue}
                errors={touched.pilotId && errors.pilotId ? [errors.pilotId] : []}
              />
            </ModalBody>
            <ModalFooter>
              <div className="ms-auto flex gap-2">
                <Button color="gray" outline onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" color="indigo">
                  Save changes
                </Button>
              </div>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
