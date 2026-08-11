import type { FormikHelpers } from "formik";
import React from "react";
import { useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import {
  type CreateOperatorFormData,
  type Operator,
  operatorFormDataToRequest,
  operatorToFormData,
} from "~/features/operator";
import { OperatorFormFields } from "~/features/operator/components/Forms/OperatorFormFields";
import { createOperatorSchema } from "~/features/operator/schema";
import { useApi } from "~/shared/api/useApi";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { FormModal } from "~/shared/ui/Form/FormModal";

type Props = {
  operator: Operator;
  close: () => void;
};

export function UpdateOperatorModal({ operator, close }: Props) {
  const { operatorService } = useApi();
  const { error, success } = useToast();
  const revalidator = useRevalidator();

  const handleSubmit = async (
    values: CreateOperatorFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateOperatorFormData>,
  ) => {
    try {
      await operatorService.update(operator.id, operatorFormDataToRequest(values));
      success(`Operator ${operator.icaoCode} updated.`);
      await revalidator.revalidate();
      close();
    } catch (err) {
      handleFormikApiError<CreateOperatorFormData>(err, setErrors, error, "Failed to update operator.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormModal<CreateOperatorFormData>
      context="Operator"
      title="Update"
      submitLabel="Save changes"
      initialValues={operatorToFormData(operator)}
      validationSchema={createOperatorSchema}
      onSubmit={handleSubmit}
      close={close}
      size="lg"
    >
      <OperatorFormFields />
    </FormModal>
  );
}
