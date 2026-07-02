import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React from "react";
import type { DelayReport } from "~/models";
import {
  initRejectDelayReportData,
  type RejectDelayReportFormData,
  rejectDelayReportFormDataToRequest,
} from "~/models";
import { translateDelayReasonCode } from "~/models/i18n/delay.i18n";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { ManagedTextareaBlock } from "~/shared/ui/Form/Managed/ManagedTextareaBlock";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";
import { useToast } from "~/state/app/context/useToast";
import { rejectDelayReportSchema } from "~/validator/form/delay.schema";

type Props = {
  report: DelayReport;
  close: () => void;
};

export function RejectDelayReportModal({ report, close }: Props) {
  const { rejectDelayReport } = useTrackedFlight();
  const { error, success } = useToast();

  const handleSubmit = async (
    values: RejectDelayReportFormData,
    { setErrors, setSubmitting }: FormikHelpers<RejectDelayReportFormData>,
  ) => {
    try {
      await rejectDelayReport(report.id, rejectDelayReportFormDataToRequest(values));
      success("Delay report sent back to the crew.");
      close();
    } catch (err) {
      handleFormikApiError<RejectDelayReportFormData>(err, setErrors, error, "Failed to reject delay report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal size="lg" className="text-gray-800 dark:text-white" show onClose={close}>
      <ModalHeader>Reject delay report?</ModalHeader>
      <ModalBody>
        <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
          This sends the {report.delayMinutes}-minute allocation for{" "}
          <span className="font-semibold">{translateDelayReasonCode(report.reasonCode)}</span> back to the crew to amend
          or remove. The flight cannot be closed until the report is replaced.
        </p>
        <Formik<RejectDelayReportFormData>
          initialValues={initRejectDelayReportData()}
          validationSchema={rejectDelayReportSchema()}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <FormikForm id="rejectDelayReportForm" noValidate>
              <ManagedTextareaBlock
                field="rejectionReason"
                label="Rejection reason"
                placeholder="Explain what the crew should correct."
              />
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
          <Button type="submit" form="rejectDelayReportForm" color="red">
            Reject report
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
