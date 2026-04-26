"use client";

import type { Route } from ".react-router/types/app/routes/operations/operators/+types/EditOperatorRoute";
import { Button } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import { ManagedInputBlock } from "~/components/shared/Form/Managed/ManagedInputBlock";
import { ManagedSelectBlock } from "~/components/shared/Form/Managed/ManagedSelectBlock";
import { Container } from "~/components/shared/Layout/Container";
import { SectionHeader } from "~/components/shared/Section/SectionHeader";
import type { TopNavRouteHandle } from "~/components/shared/TopNav/types";
import { handleFormikApiError } from "~/functions/handleFormikApiError";
import {
  type CreateOperatorFormData,
  continentOptions,
  type Operator,
  operatorFormDataToRequest,
  operatorToFormData,
  operatorTypeOptions,
} from "~/models";
import { useApi } from "~/state/api/context/useApi";
import { OperatorService } from "~/state/api/operator.service";
import { useToast } from "~/state/app/context/useToast";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";
import { createOperatorSchema } from "~/validator/form/operator.schema";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return new OperatorService().fetchById(params.operatorId);
}

export const handle: TopNavRouteHandle = {
  breadcrumbs: (data) => {
    const operator = data as Operator;
    return [
      { label: "Operators", to: "/operators" },
      {
        label: (
          <>
            <span className="font-mono">{operator.iataCode}</span> · {operator.shortName}
          </>
        ),
        to: `/operators/${operator.id}/fleet`,
      },
      { label: "Edit" },
    ];
  },
};

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
