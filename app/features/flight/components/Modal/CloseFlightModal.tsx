import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React from "react";
import { useToast } from "~/app-state/useToast";
import { CloseFlightForm } from "~/features/flight/components/Forms/CloseFlightForm";
import {
  closeFlightFormDataToActualFuelBurned,
  type FlatCloseFlightFormData,
  initCloseFlightData,
} from "~/features/flight/form-types";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { closeFlightSchema } from "~/features/flight/schema";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { ModalActions } from "~/shared/ui/Modal/ModalActions";
import { ModalTitle } from "~/shared/ui/Modal/ModalTitle";

type Props = {
  onClose: () => void;
};

export function CloseFlightModal({ onClose }: Props) {
  const { close, loadsheets } = useTrackedFlight();
  const { error, success } = useToast();

  const plannedTrip = loadsheets.final?.fuel?.trip ?? null;

  const handleSubmit = async (
    values: FlatCloseFlightFormData,
    { setErrors, setSubmitting }: FormikHelpers<FlatCloseFlightFormData>,
  ) => {
    try {
      await close(closeFlightFormDataToActualFuelBurned(values));
      success("Flight closed.");
      onClose();
    } catch (err) {
      handleFormikApiError<FlatCloseFlightFormData>(err, setErrors, error, "Failed to close the flight.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal size="lg" className="text-gray-800 dark:text-white" show onClose={onClose}>
      <ModalHeader>
        <ModalTitle context="Flight" action="Close" />
      </ModalHeader>
      <ModalBody>
        <Formik<FlatCloseFlightFormData>
          initialValues={initCloseFlightData()}
          validationSchema={closeFlightSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <FormikForm id="closeFlightForm" noValidate>
              <CloseFlightForm plannedTrip={plannedTrip} />
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
        cancel={{ onClick: onClose }}
        confirm={{ label: "Close flight", type: "submit", form: "closeFlightForm" }}
      />
    </Modal>
  );
}
