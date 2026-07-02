import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React from "react";
import { useToast } from "~/app-state/useToast";
import { EmergencyFormFields } from "~/features/emergency/components/EmergencyFormFields";
import { declareEmergencySchema } from "~/features/emergency/schema";
import { type DeclareEmergencyFormData, type Emergency, emergencyToFormData, updateFormDataToRequest } from "~/models";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";

type Props = {
  emergency: Emergency;
  close: () => void;
};

export function UpdateEmergencyModal({ emergency, close }: Props) {
  const { updateEmergency } = useTrackedFlight();
  const { error, success } = useToast();

  const handleSubmit = async (
    values: DeclareEmergencyFormData,
    { setErrors, setSubmitting }: FormikHelpers<DeclareEmergencyFormData>,
  ) => {
    try {
      await updateEmergency(emergency.id, updateFormDataToRequest(values));
      success("Emergency updated.");
      close();
    } catch (err) {
      handleFormikApiError<DeclareEmergencyFormData>(err, setErrors, error, "Failed to update emergency.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal size="lg" className="text-gray-800 dark:text-white" show onClose={close}>
      <ModalHeader>Update emergency</ModalHeader>
      <ModalBody>
        <Formik<DeclareEmergencyFormData>
          initialValues={emergencyToFormData(emergency)}
          validationSchema={declareEmergencySchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <FormikForm id="updateEmergencyForm" noValidate>
              <EmergencyFormFields />
              <div className="hidden">
                <button type="submit" disabled={isSubmitting}>
                  submit
                </button>
              </div>
            </FormikForm>
          )}
        </Formik>
      </ModalBody>
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button color="gray" outline onClick={close}>
            Cancel
          </Button>
          <Button type="submit" form="updateEmergencyForm" color="indigo">
            Save changes
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
