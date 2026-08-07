import type { FormikHelpers } from "formik";
import React from "react";
import { useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import type { Airport } from "~/features/airport";
import { type CreateTerminalFormData, initCreateTerminalData } from "~/features/terminal";
import { TerminalFormFields } from "~/features/terminal/components/TerminalFormFields";
import { createTerminalSchema } from "~/features/terminal/schema";
import { terminalFormDataToRequest } from "~/features/terminal/transformer";
import { useApi } from "~/shared/api/useApi";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { FormModal } from "~/shared/ui/Form/FormModal";

type Props = {
  airport: Airport;
  close: () => void;
};

export function CreateTerminalModal({ airport, close }: Props) {
  const { terminalService } = useApi();
  const { error, success } = useToast();
  const revalidator = useRevalidator();

  const handleSubmit = async (
    values: CreateTerminalFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateTerminalFormData>,
  ) => {
    try {
      const created = await terminalService.createNew(airport.id, terminalFormDataToRequest(values));
      success(`Terminal ${created.shortName} created.`);
      close();
      revalidator.revalidate();
    } catch (err) {
      handleFormikApiError<CreateTerminalFormData>(err, setErrors, error, "Failed to create terminal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormModal<CreateTerminalFormData>
      title="Add terminal"
      submitLabel="Create terminal"
      initialValues={initCreateTerminalData()}
      validationSchema={createTerminalSchema}
      onSubmit={handleSubmit}
      close={close}
    >
      <TerminalFormFields airportLocation={airport.location} />
    </FormModal>
  );
}
