import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React from "react";
import { DiversionFormFields } from "~/components/flight/Dashboard/Diversion/DiversionFormFields";
import { handleFormikApiError } from "~/functions/handleFormikApiError";
import { type Diversion, diversionToFormData, type ReportDiversionFormData, reportFormDataToRequest } from "~/models";
import { usePublicApi } from "~/state/api/context/usePublicApi";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";
import { useToast } from "~/state/app/context/useToast";
import { reportDiversionSchema } from "~/validator/form/diversion.schema";

type Props = {
  diversion: Diversion;
  close: () => void;
};

export function UpdateDiversionModal({ diversion, close }: Props) {
  const { flight, updateDiversion } = useTrackedFlight();
  const { adsbService } = usePublicApi();
  const { error, success } = useToast();

  const handleSubmit = async (
    values: ReportDiversionFormData,
    { setErrors, setSubmitting }: FormikHelpers<ReportDiversionFormData>,
  ) => {
    if (!flight) return;
    try {
      const path = await adsbService.getRecordsByCallsign(flight.callsign).catch(() => []);
      const last = path[path.length - 1];
      const position = last ? { latitude: last.latitude, longitude: last.longitude } : diversion.position;
      await updateDiversion(reportFormDataToRequest(values, position));
      success("Diversion updated.");
      close();
    } catch (err) {
      handleFormikApiError<ReportDiversionFormData>(err, setErrors, error, "Failed to update diversion.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal size="lg" className="text-gray-800 dark:text-white" show onClose={close}>
      <ModalHeader>Update diversion</ModalHeader>
      <ModalBody>
        <Formik<ReportDiversionFormData>
          initialValues={diversionToFormData(diversion)}
          validationSchema={reportDiversionSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <FormikForm id="updateDiversionForm" noValidate>
              <DiversionFormFields />
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
          <Button type="submit" form="updateDiversionForm" color="indigo">
            Save changes
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
