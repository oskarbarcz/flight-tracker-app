import type { FormikHelpers } from "formik";
import React from "react";
import { useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import type { Airport } from "~/features/airport";
import { type CreateRunwayFormData, initCreateRunwayData } from "~/features/runway";
import { RunwayFormFields } from "~/features/runway/components/RunwayFormFields";
import { createRunwaySchema } from "~/features/runway/schema";
import { runwayFormDataToRequest } from "~/features/runway/transformer";
import { useApi } from "~/shared/api/useApi";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { FormModal } from "~/shared/ui/Form/FormModal";

type Props = {
  airport: Airport;
  close: () => void;
};

export function CreateRunwayModal({ airport, close }: Props) {
  const { runwayService } = useApi();
  const { error, success } = useToast();
  const revalidator = useRevalidator();

  const handleSubmit = async (
    values: CreateRunwayFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateRunwayFormData>,
  ) => {
    try {
      const created = await runwayService.createNew(airport.id, runwayFormDataToRequest(values));
      success(`Runway ${created.designator} created.`);
      close();
      revalidator.revalidate();
    } catch (err) {
      handleFormikApiError<CreateRunwayFormData>(err, setErrors, error, "Failed to create runway.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormModal<CreateRunwayFormData>
      title="Add runway"
      submitLabel="Create runway"
      initialValues={initCreateRunwayData()}
      validationSchema={createRunwaySchema}
      onSubmit={handleSubmit}
      close={close}
    >
      <RunwayFormFields airportLocation={airport.location} />
    </FormModal>
  );
}
