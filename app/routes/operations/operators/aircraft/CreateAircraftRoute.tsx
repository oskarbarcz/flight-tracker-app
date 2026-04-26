"use client";

import type { Route } from ".react-router/types/app/routes/operations/operators/aircraft/+types/CreateAircraftRoute";
import { Button } from "flowbite-react";
import { Formik, type FormikErrors, Form as FormikForm, type FormikTouched } from "formik";
import React, { useEffect } from "react";
import { useActionData, useNavigate, useSubmit } from "react-router";
import { InputBlock } from "~/components/shared/Form/InputBlock";
import { Container } from "~/components/shared/Layout/Container";
import { SectionHeader } from "~/components/shared/Section/SectionHeader";
import type { TopNavRouteHandle } from "~/components/shared/TopNav/types";
import getFormData from "~/functions/getFormData";
import { handleRequestError, handleRequestSuccess } from "~/functions/handleRequest";
import type { Operator } from "~/models";
import { AircraftService } from "~/state/api/aircraft.service";
import { OperatorService } from "~/state/api/operator.service";
import type { CreateAircraftRequest } from "~/state/api/request/operator.request";
import { useToast } from "~/state/app/context/useToast";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";
import { aircraftSchema } from "~/validator/form/aircraft.schema";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const operator = await new OperatorService().fetchById(params.operatorId);
  return { operator };
}

export const handle: TopNavRouteHandle = {
  breadcrumbs: (data) => {
    const { operator } = data as { operator: Operator };
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
      { label: "New aircraft" },
    ];
  },
};

export async function clientAction({ params, request }: Route.ClientActionArgs) {
  const aircraftService = new AircraftService();

  const form = await request.formData();
  const aircraft: CreateAircraftRequest = getFormData<CreateAircraftRequest>(form, [
    "icaoCode",
    "shortName",
    "fullName",
    "selcal",
    "registration",
    "livery",
  ]);

  return aircraftService.createNew(params.operatorId, aircraft).then(handleRequestSuccess).catch(handleRequestError);
}

export default function CreateAircraftRoute({ params }: Route.ComponentProps) {
  usePageTitle("Create new aircraft");

  const navigate = useNavigate();
  const submit = useSubmit();
  const { error } = useToast();
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

  const handleSubmit = (values: CreateAircraftRequest) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
      formData.append(key, value as string);
    }
    submit(formData, { method: "post" });
  };

  const getErrors = (
    name: keyof CreateAircraftRequest,
    formikErrors: FormikErrors<CreateAircraftRequest>,
    formikTouched: FormikTouched<CreateAircraftRequest>,
  ) => {
    const serverErrors = response?.isError ? response.errorsForKey(name) : [];
    const clientError = formikTouched[name] && formikErrors[name] ? [formikErrors[name]] : [];
    return [...new Set([...clientError, ...serverErrors])];
  };

  return (
    <div className="mx-auto max-w-md pb-4">
      <SectionHeader title="Create new aircraft" />

      <Formik<CreateAircraftRequest>
        initialValues={{
          icaoCode: "",
          shortName: "",
          fullName: "",
          registration: "",
          selcal: "",
          livery: "",
        }}
        validationSchema={aircraftSchema}
        onSubmit={handleSubmit}
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
                Create new aircraft
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
