"use client";

import type { Route } from ".react-router/types/app/routes/operations/operators/aircraft/+types/EditAircraftRoute";
import { Button } from "flowbite-react";
import { Formik, type FormikErrors, Form as FormikForm, type FormikTouched } from "formik";
import React, { type JSX, useEffect } from "react";
import { useActionData, useLoaderData, useNavigate, useSubmit } from "react-router";
import InputBlock from "~/components/shared/Form/InputBlock";
import Container from "~/components/shared/Layout/Container";
import SectionHeaderWithBackButton from "~/components/shared/Section/SectionHeaderWithBackButton";
import getFormData from "~/functions/getFormData";
import { handleRequestError, handleRequestSuccess } from "~/functions/handleRequest";
import { AircraftService } from "~/state/api/aircraft.service";
import type { EditAircraftRequest } from "~/state/api/request/operator.request";
import { useToast } from "~/state/app/context/useToast";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";
import { aircraftSchema } from "~/validator/form/aircraft.schema";

export async function clientAction({ request, params }: Route.ClientActionArgs) {
  const aircraftService = new AircraftService();

  const form = await request.formData();
  const aircraft = getFormData<EditAircraftRequest>(form, [
    "icaoCode",
    "shortName",
    "fullName",
    "selcal",
    "registration",
    "livery",
  ]);

  return aircraftService
    .update(params.operatorId, params.aircraftId, aircraft)
    .then(handleRequestSuccess)
    .catch(handleRequestError);
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const aircraft = await new AircraftService().fetchById(params.aircraftId);
  return { aircraft };
}

export default function EditAircraftRoute({ params }: Route.ComponentProps): JSX.Element {
  usePageTitle("Edit aircraft");

  const navigate = useNavigate();
  const submit = useSubmit();
  const { error } = useToast();
  const { aircraft } = useLoaderData<typeof clientLoader>();
  const response = useActionData<typeof clientAction>();

  useEffect(() => {
    if (!response) return;

    if (response.isSuccessful) {
      navigate(`/operators/${params.operatorId}/fleet`, {
        viewTransition: true,
        replace: true,
        preventScrollReset: true,
      });
    }
    if (response.isError && response.oneGeneralError) {
      error(response.oneGeneralError);
    }
  }, [response, params.operatorId, navigate, error]);

  const handleSubmit = (values: EditAircraftRequest) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
      formData.append(key, value as string);
    }
    submit(formData, { method: "post" });
  };

  const getErrors = (
    name: keyof EditAircraftRequest,
    formikErrors: FormikErrors<EditAircraftRequest>,
    formikTouched: FormikTouched<EditAircraftRequest>,
  ) => {
    const serverErrors = response?.isError ? response.errorsForKey(name) : [];
    const clientError = formikTouched[name] && formikErrors[name] ? [formikErrors[name]] : [];
    return [...new Set([...clientError, ...serverErrors])];
  };

  return (
    <div className="mx-auto max-w-md pb-4">
      <SectionHeaderWithBackButton
        sectionTitle="Edit aircraft"
        backText="Back to operator"
        backUrl={`/operators/${params.operatorId}/fleet`}
      />

      <Formik<EditAircraftRequest>
        initialValues={{
          icaoCode: aircraft.icaoCode,
          shortName: aircraft.shortName,
          fullName: aircraft.fullName,
          registration: aircraft.registration,
          selcal: aircraft.selcal,
          livery: aircraft.livery,
        }}
        validationSchema={aircraftSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors: formikErrors, touched, handleChange, handleBlur, values }) => (
          <FormikForm noValidate>
            <Container>
              <div className="flex flex-col gap-4">
                <InputBlock
                  htmlName="icaoCode"
                  label="ICAO code"
                  value={values.icaoCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={getErrors("icaoCode", formikErrors, touched)}
                />
                <InputBlock
                  htmlName="shortName"
                  label="Short name"
                  value={values.shortName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={getErrors("shortName", formikErrors, touched)}
                />
                <InputBlock
                  htmlName="fullName"
                  label="Full name"
                  value={values.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={getErrors("fullName", formikErrors, touched)}
                />
                <InputBlock
                  htmlName="registration"
                  label="Registration"
                  value={values.registration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={getErrors("registration", formikErrors, touched)}
                />
                <InputBlock
                  htmlName="selcal"
                  label="SELCAL"
                  value={values.selcal}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={getErrors("selcal", formikErrors, touched)}
                />
                <InputBlock
                  htmlName="livery"
                  label="Livery name"
                  value={values.livery}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={getErrors("livery", formikErrors, touched)}
                />
              </div>
            </Container>

            <div className="flex justify-end pt-4">
              <Button type="submit" color="indigo">
                Save changes
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
