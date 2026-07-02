import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React from "react";
import { ManagedGroupedSelectBlock } from "~/components/shared/Form/Managed/ManagedGroupedSelectBlock";
import { ManagedInputBlock } from "~/components/shared/Form/Managed/ManagedInputBlock";
import { ManagedTextareaBlock } from "~/components/shared/Form/Managed/ManagedTextareaBlock";
import { type FileDelayReportFormData, fileDelayReportFormDataToRequest, initFileDelayReportData } from "~/models";
import { delayReasonOptionGroups } from "~/models/i18n/delay.i18n";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";
import { useToast } from "~/state/app/context/useToast";
import { fileDelayReportSchema } from "~/validator/form/delay.schema";

type Props = {
  maxMinutes: number;
  close: () => void;
};

export function FileDelayReportModal({ maxMinutes, close }: Props) {
  const { fileDelayReport } = useTrackedFlight();
  const { error, success } = useToast();

  const reasonGroups = delayReasonOptionGroups.map((group) => ({
    label: group.category,
    options: group.options,
  }));

  const handleSubmit = async (
    values: FileDelayReportFormData,
    { setErrors, setSubmitting }: FormikHelpers<FileDelayReportFormData>,
  ) => {
    try {
      await fileDelayReport(fileDelayReportFormDataToRequest(values));
      success("Delay report filed.");
      close();
    } catch (err) {
      handleFormikApiError<FileDelayReportFormData>(err, setErrors, error, "Failed to file delay report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal size="lg" className="text-gray-800 dark:text-white" show onClose={close}>
      <ModalHeader>File delay report</ModalHeader>
      <ModalBody>
        <Formik<FileDelayReportFormData>
          initialValues={initFileDelayReportData()}
          validationSchema={fileDelayReportSchema(maxMinutes)}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <FormikForm id="fileDelayReportForm" noValidate>
              <ManagedGroupedSelectBlock field="reasonCode" label="Reason" groups={reasonGroups} />
              <ManagedInputBlock
                field="delayMinutes"
                label={`Delay minutes (up to ${maxMinutes} unallocated)`}
                type="number"
              />
              <ManagedTextareaBlock
                field="freeText"
                label="Note"
                required={false}
                placeholder="Optional context for Operations."
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
          <Button type="submit" form="fileDelayReportForm" color="blue">
            File report
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
