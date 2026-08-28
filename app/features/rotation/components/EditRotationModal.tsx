import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { Form, Formik } from "formik";
import React from "react";
import { PilotLicenseInputBlock } from "~/features/rotation/components/PilotLicenseInputBlock";
import { RotationTmi } from "~/features/rotation/components/RotationTmi";
import type { CreateRotationRequest } from "~/features/rotation/request";
import { createRotationSchema } from "~/features/rotation/schema";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

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
      <ModalHeader>
        <ModalTitle context="Rotation" action="Edit" />
      </ModalHeader>
      <Formik<CreateRotationRequest>
        initialValues={{ name, pilotId }}
        validationSchema={createRotationSchema}
        onSubmit={submit}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form className="flex min-h-0 flex-1 flex-col">
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
            <ModalActions cancel={{ onClick: onClose }} confirm={{ label: "Save changes", type: "submit" }} />
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
