"use client";

import { Button } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React from "react";
import { useNavigate } from "react-router";
import { SkyLinkAutofillPanel } from "~/components/airport/Forms/SkyLinkAutofillPanel";
import { ManagedInputBlock } from "~/components/shared/Form/Managed/ManagedInputBlock";
import { ManagedSelectBlock } from "~/components/shared/Form/Managed/ManagedSelectBlock";
import { Container } from "~/components/shared/Layout/Container";
import { SectionHeaderWithBackButton } from "~/components/shared/Section/SectionHeaderWithBackButton";
import { handleFormikApiError } from "~/functions/handleFormikApiError";
import { type CreateAirportFormData, continentOptions, initCreateAirportData } from "~/models";
import { useApi } from "~/state/api/context/useApi";
import { formDataToApiFormat } from "~/state/api/transformer/airport.transformer";
import { useToast } from "~/state/app/context/useToast";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";
import { createAirportSchema } from "~/validator/form/create-airport.schema";

export default function CreateAirportRoute() {
  usePageTitle("Create new airport");

  const { airportService } = useApi();
  const navigate = useNavigate();
  const { error } = useToast();

  const handleSubmit = async (
    values: CreateAirportFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateAirportFormData>,
  ) => {
    try {
      const newAirport = formDataToApiFormat(values);
      await airportService.createNew(newAirport);
      navigate(`/airports?continent=${newAirport.continent}`, { viewTransition: true });
    } catch (err) {
      handleFormikApiError<CreateAirportFormData>(err, setErrors, error, "Failed to create airport.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md pb-4">
      <SectionHeaderWithBackButton sectionTitle="Create new airport" backText="Back to airports" backUrl="/airports" />

      <Formik<CreateAirportFormData>
        initialValues={initCreateAirportData()}
        validationSchema={createAirportSchema}
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
                </div>
              </Container>

              <div className="flex justify-end">
                <Button type="submit" color="indigo" disabled={isSubmitting}>
                  Create airport
                </Button>
              </div>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
