import type { Route } from ".react-router/types/app/routes/operations/operators/+types/EditOperatorRoute";
import { Button } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import { useToast } from "~/app-state/useToast";
import { createOperatorSchema } from "~/features/operator/schema";
import { OperatorService } from "~/features/operator/service";
import {
  type CreateOperatorFormData,
  continentOptions,
  type Operator,
  operatorFormDataToRequest,
  operatorToFormData,
  operatorTypeOptions,
} from "~/models";
import { useApi } from "~/shared/api/useApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { ManagedInputBlock } from "~/shared/ui/Form/Managed/ManagedInputBlock";
import { ManagedSelectBlock } from "~/shared/ui/Form/Managed/ManagedSelectBlock";
import { Container } from "~/shared/ui/Layout/Container";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return new OperatorService().fetchById(params.operatorId);
}

export default function EditOperatorRoute() {
  usePageTitle("Edit operator");

  const { operatorService } = useApi();
  const navigate = useNavigate();
  const { error } = useToast();
  const operator = useLoaderData<Operator>();

  const handleSubmit = async (
    values: CreateOperatorFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateOperatorFormData>,
  ) => {
    try {
      await operatorService.update(operator.id, operatorFormDataToRequest(values));
      navigate(`/operators/${operator.id}/fleet`, { viewTransition: true });
    } catch (err) {
      handleFormikApiError<CreateOperatorFormData>(err, setErrors, error, "Failed to update operator.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md pb-4">
      <SectionHeader title="Edit operator" />

      <Formik<CreateOperatorFormData>
        initialValues={operatorToFormData(operator)}
        validationSchema={createOperatorSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <FormikForm noValidate>
            <Container>
              <div className="flex flex-col">
                <div className="flex gap-4">
                  <div className="basis-1/2">
                    <ManagedInputBlock field="icaoCode" label="ICAO code" />
                  </div>
                  <div className="basis-1/2">
                    <ManagedInputBlock field="iataCode" label="IATA code" />
                  </div>
                </div>

                <ManagedInputBlock field="shortName" label="Short name" />
                <ManagedInputBlock field="fullName" label="Full name" />
                <ManagedInputBlock field="callsign" label="Callsign" />

                <div className="flex gap-4">
                  <ManagedSelectBlock
                    className="basis-1/2"
                    field="type"
                    label="Operator type"
                    options={operatorTypeOptions}
                  />
                  <ManagedSelectBlock
                    className="basis-1/2"
                    field="continent"
                    label="Continent"
                    options={continentOptions}
                  />
                </div>

                <ManagedInputBlock field="avgFleetAge" label="Average fleet age" type="number" />
                <ManagedInputBlock field="hubs" label="Hubs (comma-separated IATA codes)" required={false} />
                <ManagedInputBlock field="logoUrl" label="Logo URL" required={false} />
                <ManagedInputBlock field="backgroundUrl" label="Background URL" required={false} />
              </div>
            </Container>

            <div className="flex justify-end pt-4">
              <Button type="submit" color="indigo" disabled={isSubmitting}>
                Save changes
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
