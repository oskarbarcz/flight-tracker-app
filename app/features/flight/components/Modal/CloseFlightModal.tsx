import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React from "react";
import { useToast } from "~/app-state/useToast";
import type { Flight } from "~/features/flight";
import { CloseFlightForm } from "~/features/flight/components/Forms/CloseFlightForm";
import {
  closeFlightFormDataToActualFuelBurned,
  type FlatCloseFlightFormData,
  initCloseFlightData,
} from "~/features/flight/form-types";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { closeFlightSchema } from "~/features/flight/schema";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";

type Props = {
  flight: Flight;
  onClose: () => void;
};

export function CloseFlightModal({ flight, onClose }: Props) {
  const { close } = useTrackedFlight();
  const { error, success } = useToast();

  const plannedTrip = flight.loadsheets.final?.fuel?.trip ?? null;

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
      <ModalHeader>Close flight</ModalHeader>
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
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button color="gray" outline onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="closeFlightForm" color="indigo" outline>
            Close flight
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
