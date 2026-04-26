"use client";

import { Button } from "flowbite-react";
import { Formik, Form as FormikForm, type FormikHelpers } from "formik";
import React from "react";
import { useNavigate } from "react-router";
import { ManagedInputBlock } from "~/components/shared/Form/Managed/ManagedInputBlock";
import { ManagedSelectBlock } from "~/components/shared/Form/Managed/ManagedSelectBlock";
import { Container } from "~/components/shared/Layout/Container";
import { SectionHeaderWithBackButton } from "~/components/shared/Section/SectionHeaderWithBackButton";
import { handleFormikApiError } from "~/functions/handleFormikApiError";
import {
  type CreateOperatorFormData,
  continentOptions,
  initCreateOperatorData,
  operatorFormDataToRequest,
  operatorTypeOptions,
} from "~/models";
import { useApi } from "~/state/api/context/useApi";
import { useToast } from "~/state/app/context/useToast";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";
import { createOperatorSchema } from "~/validator/form/operator.schema";

export default function CreateOperatorRoute() {
  usePageTitle("Create new operator");

  const { operatorService } = useApi();
  const navigate = useNavigate();
  const { error } = useToast();

  const handleSubmit = async (
    values: CreateOperatorFormData,
    { setErrors, setSubmitting }: FormikHelpers<CreateOperatorFormData>,
  ) => {
    try {
      await operatorService.createNew(operatorFormDataToRequest(values));
      navigate("/operators", { viewTransition: true });
    } catch (err) {
      handleFormikApiError<CreateOperatorFormData>(err, setErrors, error, "Failed to create operator.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md pb-4">
      <SectionHeaderWithBackButton
        sectionTitle="Create new operator"
        backText="Back to operators"
        backUrl="/operators"
      />

      <Formik<CreateOperatorFormData>
        initialValues={initCreateOperatorData()}
        validationSchema={createOperatorSchema}
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
                Create new operator
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
