import type { FormikHelpers } from "formik";
import React from "react";
import { useToast } from "~/app-state/useToast";
import {
  type CreateOperatorFormData,
  initCreateOperatorData,
  type Operator,
  operatorFormDataToRequest,
} from "~/features/operator";
import { OperatorFormFields } from "~/features/operator/components/Forms/OperatorFormFields";
import { createOperatorSchema } from "~/features/operator/schema";
import { useApi } from "~/shared/api/useApi";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { FormModal } from "~/shared/ui/Form/FormModal";

type Props = {
  close: () => void;
  onCreated: (operator: Operator) => Promise<void>;
};

export function CreateOperatorModal({ close, onCreated }: Props) {
  const { operatorService } = useApi();
  const { error, success } = useToast();

  const handleSubmit = async (
    values: CreateOperatorFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateOperatorFormData>,
  ) => {
    try {
      const created = await operatorService.createNew(operatorFormDataToRequest(values));
      success(`Operator ${created.icaoCode} created.`);
      await onCreated(created);
    } catch (err) {
      handleFormikApiError<CreateOperatorFormData>(err, setErrors, error, "Failed to create operator.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormModal<CreateOperatorFormData>
      context="Operator"
      title="Create new"
      submitLabel="Create operator"
      initialValues={initCreateOperatorData()}
      validationSchema={createOperatorSchema}
      onSubmit={handleSubmit}
      close={close}
      size="lg"
    >
      <OperatorFormFields />
    </FormModal>
  );
}
