import type { FormikHelpers } from "formik";
import React from "react";
import { useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import type { Airport } from "~/features/airport";
import type { CreateTerminalFormData, Terminal } from "~/features/terminal";
import { TerminalFormFields } from "~/features/terminal/components/TerminalFormFields";
import { createTerminalSchema } from "~/features/terminal/schema";
import { terminalFormDataToRequest, terminalToFormData } from "~/features/terminal/transformer";
import { useApi } from "~/shared/api/useApi";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { FormModal } from "~/shared/ui/Form/FormModal";

type Props = {
  airport: Airport;
  terminal: Terminal;
  close: () => void;
};

export function EditTerminalModal({ airport, terminal, close }: Props) {
  const { terminalService } = useApi();
  const { error, success } = useToast();
  const revalidator = useRevalidator();

  const handleSubmit = async (
    values: CreateTerminalFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateTerminalFormData>,
  ) => {
    try {
      await terminalService.update(airport.id, terminal.id, terminalFormDataToRequest(values));
      success(`Terminal ${terminal.shortName} updated.`);
      close();
      revalidator.revalidate();
    } catch (err) {
      handleFormikApiError<CreateTerminalFormData>(err, setErrors, error, "Failed to update terminal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormModal<CreateTerminalFormData>
      context="Terminal"
      title={`Edit ${terminal.shortName}`}
      submitLabel="Save changes"
      initialValues={terminalToFormData(terminal)}
      validationSchema={createTerminalSchema}
      onSubmit={handleSubmit}
      close={close}
    >
      <TerminalFormFields airportLocation={airport.location} />
    </FormModal>
  );
}
