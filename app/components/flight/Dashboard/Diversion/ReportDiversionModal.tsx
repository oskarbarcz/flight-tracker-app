import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React from "react";
import { useToast } from "~/app-state/useToast";
import { DiversionFormFields } from "~/components/flight/Dashboard/Diversion/DiversionFormFields";
import { initReportDiversionData, type ReportDiversionFormData, reportFormDataToRequest } from "~/models";
import { usePublicApi } from "~/shared/api/usePublicApi";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";
import type { ApiCoordinates } from "~/state/api/request/emergency.request";
import { reportDiversionSchema } from "~/validator/form/diversion.schema";

type Props = {
  close: () => void;
};

async function fetchCurrentPosition(
  adsbService: ReturnType<typeof usePublicApi>["adsbService"],
  callsign: string,
): Promise<ApiCoordinates | null> {
  try {
    const path = await adsbService.getRecordsByCallsign(callsign);
    if (path.length === 0) return null;
    const last = path[path.length - 1];
    return { latitude: last.latitude, longitude: last.longitude };
  } catch {
    return null;
  }
}

export function ReportDiversionModal({ close }: Props) {
  const { flight, reportDiversion } = useTrackedFlight();
  const { adsbService } = usePublicApi();
  const { error, success } = useToast();

  const handleSubmit = async (
    values: ReportDiversionFormData,
    { setErrors, setSubmitting }: FormikHelpers<ReportDiversionFormData>,
  ) => {
    if (!flight) return;
    try {
      const position = (await fetchCurrentPosition(adsbService, flight.callsign)) ?? {
        latitude: flight.destinationAirport.location.latitude,
        longitude: flight.destinationAirport.location.longitude,
      };
      await reportDiversion(reportFormDataToRequest(values, position));
      success("Diversion reported.");
      close();
    } catch (err) {
      handleFormikApiError<ReportDiversionFormData>(err, setErrors, error, "Failed to report diversion.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal size="lg" className="text-gray-800 dark:text-white" show onClose={close}>
      <ModalHeader>Report diversion</ModalHeader>
      <ModalBody>
        <Formik<ReportDiversionFormData>
          initialValues={initReportDiversionData()}
          validationSchema={reportDiversionSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <FormikForm id="reportDiversionForm" noValidate>
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
          <Button type="submit" form="reportDiversionForm" color="red">
            Report diversion
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
