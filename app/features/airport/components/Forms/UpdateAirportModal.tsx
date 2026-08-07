import type { FormikHelpers } from "formik";
import React from "react";
import { useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import type { Airport, CreateAirportFormData } from "~/features/airport";
import { AirportFormFields } from "~/features/airport/components/Forms/AirportFormFields";
import { createAirportSchema } from "~/features/airport/schema";
import { airportToFormData, formDataToApiFormat } from "~/features/airport/transformer";
import { useApi } from "~/shared/api/useApi";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { FormModal } from "~/shared/ui/Form/FormModal";

type Props = {
  airport: Airport;
  close: () => void;
};

export function UpdateAirportModal({ airport, close }: Props) {
  const { airportService } = useApi();
  const { error, success } = useToast();
  const revalidator = useRevalidator();

  const handleSubmit = async (
    values: CreateAirportFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateAirportFormData>,
  ) => {
    try {
      await airportService.update(airport.id, formDataToApiFormat(values));
      success(`Airport ${airport.iataCode} updated.`);
      close();
      revalidator.revalidate();
    } catch (err) {
      handleFormikApiError<CreateAirportFormData>(err, setErrors, error, "Failed to update airport.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormModal<CreateAirportFormData>
      title="Update airport data"
      submitLabel="Save changes"
      initialValues={airportToFormData(airport)}
      validationSchema={createAirportSchema}
      onSubmit={handleSubmit}
      close={close}
    >
      <AirportFormFields />
    </FormModal>
  );
}
