"use client";

import type { Route } from ".react-router/types/app/routes/operations/airports/runways/+types/CreateRunwayRoute";
import { Button } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React from "react";
import { useNavigate } from "react-router";
import { ManagedInputBlock } from "~/components/shared/Form/Managed/ManagedInputBlock";
import { ManagedSelectBlock } from "~/components/shared/Form/Managed/ManagedSelectBlock";
import { Container } from "~/components/shared/Layout/Container";
import { SectionHeader } from "~/components/shared/Section/SectionHeader";
import type { TopNavRouteHandle } from "~/components/shared/TopNav/types";
import { handleFormikApiError } from "~/functions/handleFormikApiError";
import {
  type Airport,
  type CreateRunwayFormData,
  initCreateRunwayData,
  lightingTypeOptions,
  surfaceTypeOptions,
} from "~/models";
import { AirportService } from "~/state/api/airport.service";
import { useApi } from "~/state/api/context/useApi";
import { runwayFormDataToRequest } from "~/state/api/transformer/runway.transformer";
import { useToast } from "~/state/app/context/useToast";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";
import { createRunwaySchema } from "~/validator/form/runway.schema";

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
      { label: "Runways", to: `/airports/${airport.id}/runways` },
      { label: "New runway" },
    ];
  },
};

export default function CreateRunwayRoute({ params }: Route.ComponentProps) {
  usePageTitle("Create new runway");

  const { runwayService } = useApi();
  const navigate = useNavigate();
  const { error } = useToast();

  const handleSubmit = async (
    values: CreateRunwayFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateRunwayFormData>,
  ) => {
    try {
      await runwayService.createNew(params.id, runwayFormDataToRequest(values));
      navigate(`/airports/${params.id}/runways`, { viewTransition: true });
    } catch (err) {
      handleFormikApiError<CreateRunwayFormData>(err, setErrors, error, "Failed to create runway.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md pb-4">
      <SectionHeader title="Create new runway" />

      <Formik<CreateRunwayFormData>
        initialValues={initCreateRunwayData()}
        validationSchema={createRunwaySchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <FormikForm noValidate>
            <Container>
              <div className="flex flex-col">
                <ManagedInputBlock field="designator" label="Designator" />

                <div className="flex gap-4">
                  <div className="basis-1/2">
                    <ManagedInputBlock field="length" label="Length (m)" type="number" />
                  </div>
                  <div className="basis-1/2">
                    <ManagedInputBlock field="width" label="Width (m)" type="number" />
                  </div>
                </div>

                <ManagedInputBlock field="displace" label="Displaced threshold (m)" type="number" required={false} />

                <div className="flex gap-4">
                  <div className="basis-1/2">
                    <ManagedInputBlock field="magneticHeading" label="Magnetic heading (°)" type="number" />
                  </div>
                  <div className="basis-1/2">
                    <ManagedInputBlock field="trueHeading" label="True heading (°)" type="number" required={false} />
                  </div>
                </div>

                <ManagedInputBlock field="elevation" label="Elevation (m)" type="number" required={false} />

                <div className="flex gap-4">
                  <ManagedSelectBlock
                    className="basis-1/2"
                    field="surfaceType"
                    label="Surface"
                    options={surfaceTypeOptions}
                  />
                  <ManagedSelectBlock
                    className="basis-1/2"
                    field="lightingType"
                    label="Lighting"
                    options={lightingTypeOptions}
                  />
                </div>
              </div>
            </Container>

            <div className="flex justify-end pt-4">
              <Button type="submit" color="indigo" disabled={isSubmitting}>
                Create runway
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
