import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { Form, Formik } from "formik";
import React from "react";
import { useNavigate } from "react-router";
import { useToast } from "~/app-state/useToast";
import { PilotLicenseInputBlock } from "~/features/rotation/components/PilotLicenseInputBlock";
import { RotationTmi } from "~/features/rotation/components/RotationTmi";
import type { CreateRotationRequest } from "~/features/rotation/request";
import { createRotationSchema } from "~/features/rotation/schema";
import { useApi } from "~/shared/api/useApi";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";

type Props = {
  operatorId: string;
  onClose: () => void;
};

export function RotationModal({ operatorId, onClose }: Props) {
  const { rotationService } = useApi();
  const { error } = useToast();
  const navigate = useNavigate();

  const submit = async (values: CreateRotationRequest) => {
    try {
      const rotation = await rotationService.create(operatorId, values);
      navigate(`/operators/${operatorId}/rotations/${rotation.id}`, { viewTransition: true });
    } catch (creationError) {
      error((creationError as { message?: string })?.message ?? "Could not create the rotation.");
    }
  };

  return (
    <Modal show size="lg" onClose={onClose}>
      <ModalHeader>New rotation</ModalHeader>
      <Formik<CreateRotationRequest>
        initialValues={{ name: "", pilotId: "" }}
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
                  Create rotation
                </Button>
              </div>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
