import type { Route } from ".react-router/types/app/routes/operations/airports/+types/EditAirportRoute";
import { Button } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React from "react";
import { useLoaderData, useNavigate } from "react-router";
import { SkyLinkAutofillPanel } from "~/components/airport/Forms/SkyLinkAutofillPanel";
import { type Airport, type CreateAirportFormData, continentOptions } from "~/models";
import { usePageTitle } from "~/shared/hooks/usePageTitle";
import { handleFormikApiError } from "~/shared/lib/handleFormikApiError";
import { ManagedInputBlock } from "~/shared/ui/Form/Managed/ManagedInputBlock";
import { ManagedSelectBlock } from "~/shared/ui/Form/Managed/ManagedSelectBlock";
import { AirportShapePickerSection } from "~/shared/ui/Form/MapPicker/AirportShapePickerSection";
import { Container } from "~/shared/ui/Layout/Container";
import { SectionHeader } from "~/shared/ui/Section/SectionHeader";
import { AirportService } from "~/state/api/airport.service";
import { useApi } from "~/state/api/context/useApi";
import { airportToFormData, formDataToApiFormat } from "~/state/api/transformer/airport.transformer";
import { useToast } from "~/state/app/context/useToast";
import { createAirportSchema } from "~/validator/form/create-airport.schema";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  return new AirportService().fetchById(params.id);
}

export default function EditAirportRoute() {
  const airport = useLoaderData<Airport>();
  usePageTitle(`Edit ${airport.iataCode}`);

  const { airportService } = useApi();
  const navigate = useNavigate();
  const { error } = useToast();

  const handleSubmit = async (
    values: CreateAirportFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateAirportFormData>,
  ) => {
    try {
      const updated = formDataToApiFormat(values);
      await airportService.update(airport.id, updated);
      navigate(`/airports/${airport.id}/overview`, { viewTransition: true });
    } catch (err) {
      handleFormikApiError<CreateAirportFormData>(err, setErrors, error, "Failed to update airport.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl pb-4">
      <SectionHeader title="Edit airport" />

      <Formik<CreateAirportFormData>
        initialValues={airportToFormData(airport)}
        validationSchema={createAirportSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <FormikForm noValidate>
            <div className="flex flex-col gap-4">
              <SkyLinkAutofillPanel />

              <Container>
                <div className="flex flex-col">
                  <div className="flex gap-4">
                    <div className="basis-1/2">
                      <ManagedInputBlock field="iataCode" label="IATA code" />
                    </div>
                    <div className="basis-1/2">
                      <ManagedInputBlock field="icaoCode" label="ICAO code" />
                    </div>
                  </div>

                  <ManagedInputBlock field="name" label="Airport name" />

                  <div className="flex gap-4">
                    <div className="basis-1/2">
                      <ManagedInputBlock field="city" label="City" />
                    </div>
                    <div className="basis-1/2">
                      <ManagedInputBlock field="country" label="Country" />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="basis-1/2">
                      <ManagedInputBlock field="timezone" label="Timezone" />
                    </div>
                    <ManagedSelectBlock
                      className="basis-1/2"
                      field="continent"
                      label="Continent"
                      options={continentOptions}
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="basis-1/2">
                      <ManagedInputBlock field="latitude" label="Latitude" type="number" />
                    </div>
                    <div className="basis-1/2">
                      <ManagedInputBlock field="longitude" label="Longitude" type="number" />
                    </div>
                  </div>

                  <AirportShapePickerSection />
                </div>
              </Container>

              <div className="flex justify-end">
                <Button type="submit" color="indigo" disabled={isSubmitting}>
                  Save changes
                </Button>
              </div>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
