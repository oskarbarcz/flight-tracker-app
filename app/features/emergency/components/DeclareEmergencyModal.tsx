import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React from "react";
import { useToast } from "~/app-state/useToast";
import {
  type DeclareEmergencyFormData,
  declareFormDataToRequest,
  initDeclareEmergencyData,
} from "~/features/emergency";
import { EmergencyFormFields } from "~/features/emergency/components/EmergencyFormFields";
import { declareEmergencySchema } from "~/features/emergency/schema";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  close: () => void;
};

export function DeclareEmergencyModal({ close }: Props) {
  const { declareEmergency } = useTrackedFlight();
  const { error, success } = useToast();

  const handleSubmit = async (
    values: DeclareEmergencyFormData,
    { setErrors, setSubmitting }: FormikHelpers<DeclareEmergencyFormData>,
  ) => {
    try {
      await declareEmergency(declareFormDataToRequest(values));
      success("Emergency declared.");
      close();
    } catch (err) {
      handleFormikApiError<DeclareEmergencyFormData>(err, setErrors, error, "Failed to declare emergency.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal size="lg" className="text-gray-800 dark:text-white" show onClose={close}>
      <ModalHeader>
        <ModalTitle context="Emergency" action="Declare" />
      </ModalHeader>
      <ModalBody>
        <Formik<DeclareEmergencyFormData>
          initialValues={initDeclareEmergencyData()}
          validationSchema={declareEmergencySchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <FormikForm id="declareEmergencyForm" noValidate>
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
      <ModalActions
        cancel={{ onClick: close }}
        confirm={{ label: "Declare emergency", type: "submit", form: "declareEmergencyForm", tone: "danger" }}
      />
    </Modal>
  );
}
