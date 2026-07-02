import type { Route } from ".react-router/types/app/routes/operations/airports/runways/+types/EditRunwayRoute";
import { Button } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React from "react";
import { useNavigate } from "react-router";
import { useToast } from "~/app-state/useToast";
import { AirportService } from "~/features/airport/service";
import { RunwayLocationPicker } from "~/features/runway/components/RunwayLocationPicker";
import { createRunwaySchema } from "~/features/runway/schema";
import { RunwayService } from "~/features/runway/service";
import { runwayFormDataToRequest, runwayToFormData } from "~/features/runway/transformer";
import { type CreateRunwayFormData, lightingTypeOptions, surfaceTypeOptions } from "~/models";
import { useApi } from "~/shared/api/useApi";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { ManagedInputBlock } from "~/shared/ui/Form/Managed/ManagedInputBlock";
import { ManagedSelectBlock } from "~/shared/ui/Form/Managed/ManagedSelectBlock";
import { Container } from "~/shared/ui/Layout/Container";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [airport, runway] = await Promise.all([
    new AirportService().fetchById(params.id),
    new RunwayService().fetchById(params.id, params.runwayId),
  ]);
  return { airport, runway };
}

export default function EditRunwayRoute({ params, loaderData }: Route.ComponentProps) {
  const { airport, runway } = loaderData;
  usePageTitle(`Edit runway ${runway.designator}`);

  const { runwayService } = useApi();
  const navigate = useNavigate();
  const { error } = useToast();

  const handleSubmit = async (
    values: CreateRunwayFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateRunwayFormData>,
  ) => {
    try {
      await runwayService.update(params.id, runway.id, runwayFormDataToRequest(values));
      navigate(`/airports/${params.id}/runways`, { viewTransition: true });
    } catch (err) {
      handleFormikApiError<CreateRunwayFormData>(err, setErrors, error, "Failed to update runway.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md pb-4">
      <SectionHeader title={`Edit runway ${runway.designator}`} />

      <Formik<CreateRunwayFormData>
        initialValues={runwayToFormData(runway)}
        validationSchema={createRunwaySchema}
        enableReinitialize
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
                  <div className="basis-1/2">
                    <ManagedInputBlock field="latitude" label="Latitude" type="number" />
                  </div>
                  <div className="basis-1/2">
                    <ManagedInputBlock field="longitude" label="Longitude" type="number" />
                  </div>
                </div>

                <RunwayLocationPicker airportLocation={airport.location} />

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
                Save changes
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
