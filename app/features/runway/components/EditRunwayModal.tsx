import type { FormikHelpers } from "formik";
import React from "react";
import { useRevalidator } from "react-router";
import { useToast } from "~/app-state/useToast";
import type { Airport } from "~/features/airport";
import type { CreateRunwayFormData, Runway } from "~/features/runway";
import { RunwayFormFields } from "~/features/runway/components/RunwayFormFields";
import { createRunwaySchema } from "~/features/runway/schema";
import { runwayFormDataToRequest, runwayToFormData } from "~/features/runway/transformer";
import { useApi } from "~/shared/api/useApi";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { FormModal } from "~/shared/ui/Form/FormModal";

type Props = {
  airport: Airport;
  runway: Runway;
  close: () => void;
};

export function EditRunwayModal({ airport, runway, close }: Props) {
  const { runwayService } = useApi();
  const { error, success } = useToast();
  const revalidator = useRevalidator();

  const handleSubmit = async (
    values: CreateRunwayFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateRunwayFormData>,
  ) => {
    try {
      await runwayService.update(airport.id, runway.id, runwayFormDataToRequest(values));
      success(`Runway ${runway.designator} updated.`);
      close();
      revalidator.revalidate();
    } catch (err) {
      handleFormikApiError<CreateRunwayFormData>(err, setErrors, error, "Failed to update runway.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormModal<CreateRunwayFormData>
      title={`Edit runway ${runway.designator}`}
      submitLabel="Save changes"
      initialValues={runwayToFormData(runway)}
      validationSchema={createRunwaySchema}
      onSubmit={handleSubmit}
      close={close}
    >
      <RunwayFormFields airportLocation={airport.location} />
    </FormModal>
  );
}
