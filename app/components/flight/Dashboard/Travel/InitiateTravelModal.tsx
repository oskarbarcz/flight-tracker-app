import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React from "react";
import { useAuth } from "~/app-state/useAuth";
import { useToast } from "~/app-state/useToast";
import { TravelDestinationField } from "~/components/flight/Dashboard/Travel/TravelDestinationField";
import { type InitiateTravelFormData, initInitiateTravelData } from "~/models";
import { useApi } from "~/shared/api/useApi";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { initiateTravelSchema } from "~/validator/form/travel.schema";

type Props = {
  close: () => void;
  onTravelCreated: () => void;
  currentAirportId?: string;
};

export function InitiateTravelModal({ close, onTravelCreated, currentAirportId }: Props) {
  const { travelService } = useApi();
  const { user } = useAuth();
  const { error, success } = useToast();

  const handleSubmit = async (
    values: InitiateTravelFormData,
    { setErrors, setSubmitting }: FormikHelpers<InitiateTravelFormData>,
  ) => {
    if (!user) return;
    try {
      await travelService.requestManualTravel(user.id, { destinationAirportId: values.destinationAirportId });
      success("Company travel initiated.");
      onTravelCreated();
      close();
    } catch (err) {
      handleFormikApiError<InitiateTravelFormData>(err, setErrors, error, "Failed to initiate company travel.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal size="lg" className="text-gray-800 dark:text-white" show onClose={close}>
      <ModalHeader>Initiate company travel</ModalHeader>
      <ModalBody>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Initiate a company travel when your next flight departs from a different airport than the one where your last
          flight ended. This repositions you to the new departure airport before you can plan from there.
        </p>
        <Formik<InitiateTravelFormData>
          initialValues={initInitiateTravelData()}
          validationSchema={initiateTravelSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <FormikForm id="initiateTravelForm" noValidate>
              <TravelDestinationField excludeAirportId={currentAirportId} />
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
          <Button type="submit" form="initiateTravelForm" color="indigo">
            Initiate travel
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
