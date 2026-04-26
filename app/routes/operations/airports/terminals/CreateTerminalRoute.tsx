"use client";

import type { Route } from ".react-router/types/app/routes/operations/airports/terminals/+types/CreateTerminalRoute";
import { Button, Label, Textarea } from "flowbite-react";
import { Field, Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React from "react";
import { useNavigate } from "react-router";
import { InputErrorList } from "~/components/shared/Form/InputErrorList";
import { ManagedInputBlock } from "~/components/shared/Form/Managed/ManagedInputBlock";
import { Container } from "~/components/shared/Layout/Container";
import { SectionHeader } from "~/components/shared/Section/SectionHeader";
import type { TopNavRouteHandle } from "~/components/shared/TopNav/types";
import { handleFormikApiError } from "~/functions/handleFormikApiError";
import { type Airport, type CreateTerminalFormData, initCreateTerminalData } from "~/models";
import { AirportService } from "~/state/api/airport.service";
import { useApi } from "~/state/api/context/useApi";
import { terminalFormDataToRequest } from "~/state/api/transformer/terminal.transformer";
import { useToast } from "~/state/app/context/useToast";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";
import { createTerminalSchema } from "~/validator/form/terminal.schema";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const airport = await new AirportService().fetchById(params.id);
  return { airport };
}

export const handle: TopNavRouteHandle = {
  breadcrumbs: (data) => {
    const { airport } = data as { airport: Airport };
    return [
      { label: "Airports", to: "/airports" },
      {
        label: (
          <>
            <span className="font-mono">{airport.iataCode}</span> · {airport.name}
          </>
        ),
        to: `/airports/${airport.id}/overview`,
      },
      { label: "Terminals", to: `/airports/${airport.id}/terminals` },
      { label: "New terminal" },
    ];
  },
};

export default function CreateTerminalRoute({ params }: Route.ComponentProps) {
  usePageTitle("Create new terminal");

  const { terminalService } = useApi();
  const navigate = useNavigate();
  const { error } = useToast();

  const handleSubmit = async (
    values: CreateTerminalFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateTerminalFormData>,
  ) => {
    try {
      await terminalService.createNew(params.id, terminalFormDataToRequest(values));
      navigate(`/airports/${params.id}/terminals`, { viewTransition: true });
    } catch (err) {
      handleFormikApiError<CreateTerminalFormData>(err, setErrors, error, "Failed to create terminal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md pb-4">
      <SectionHeader title="Create new terminal" />

      <Formik<CreateTerminalFormData>
        initialValues={initCreateTerminalData()}
        validationSchema={createTerminalSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <FormikForm noValidate>
            <Container>
              <div className="flex flex-col">
                <div className="flex gap-4">
                  <div className="basis-1/3">
                    <ManagedInputBlock field="shortName" label="Short name" />
                  </div>
                  <div className="basis-2/3">
                    <ManagedInputBlock field="fullName" label="Full name" />
                  </div>
                </div>

                <ManagedInputBlock field="averageTaxiTime" label="Average taxi time (min)" type="number" />

                <ManagedInputBlock
                  field="operatorCodes"
                  label="Operator ICAO codes (comma separated)"
                  required={false}
                />

                <div className="mb-4 w-full">
                  <div className="mb-2 block">
                    <Label htmlFor="text">Briefing notes</Label>
                  </div>
                  <Field as={Textarea} id="text" name="text" rows={4} placeholder="Free-text notes shown to crews." />
                  <InputErrorList
                    errorFocus={Boolean(touched.text && errors.text)}
                    errors={touched.text && errors.text ? [errors.text] : []}
                  />
                </div>
              </div>
            </Container>

            <div className="flex justify-end pt-4">
              <Button type="submit" color="indigo" disabled={isSubmitting}>
                Create terminal
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
