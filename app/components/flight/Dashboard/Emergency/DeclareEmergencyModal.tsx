import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React from "react";
import { EmergencyFormFields } from "~/components/flight/Dashboard/Emergency/EmergencyFormFields";
import { type DeclareEmergencyFormData, declareFormDataToRequest, initDeclareEmergencyData } from "~/models";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";
import { useToast } from "~/state/app/context/useToast";
import { declareEmergencySchema } from "~/validator/form/emergency.schema";

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
      <ModalHeader>Declare emergency</ModalHeader>
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
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button color="gray" outline onClick={close}>
            Cancel
          </Button>
          <Button type="submit" form="declareEmergencyForm" color="red">
            Declare emergency
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
