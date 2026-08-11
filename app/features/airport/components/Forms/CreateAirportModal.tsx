import type { FormikHelpers } from "formik";
import React from "react";
import { useToast } from "~/app-state/useToast";
import { type Airport, type CreateAirportFormData, initCreateAirportData } from "~/features/airport";
import { AirportFormFields } from "~/features/airport/components/Forms/AirportFormFields";
import { SkyLinkAutofillPanel } from "~/features/airport/components/Forms/SkyLinkAutofillPanel";
import { createAirportSchema } from "~/features/airport/schema";
import { formDataToApiFormat } from "~/features/airport/transformer";
import { useApi } from "~/shared/api/useApi";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { FormModal } from "~/shared/ui/Form/FormModal";

type Props = {
  close: () => void;
  onCreated: (airport: Airport) => void;
};

export function CreateAirportModal({ close, onCreated }: Props) {
  const { airportService } = useApi();
  const { error, success } = useToast();

  const handleSubmit = async (
    values: CreateAirportFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateAirportFormData>,
  ) => {
    try {
      const created = await airportService.createNew(formDataToApiFormat(values));
      success(`Airport ${created.iataCode} created.`);
      onCreated(created);
    } catch (err) {
      handleFormikApiError<CreateAirportFormData>(err, setErrors, error, "Failed to create airport.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormModal<CreateAirportFormData>
      context="Airport"
      title="Create new"
      submitLabel="Create airport"
      initialValues={initCreateAirportData()}
      validationSchema={createAirportSchema}
      onSubmit={handleSubmit}
      close={close}
    >
      <div className="flex flex-col gap-4">
        <SkyLinkAutofillPanel />
        <AirportFormFields />
      </div>
    </FormModal>
  );
}
