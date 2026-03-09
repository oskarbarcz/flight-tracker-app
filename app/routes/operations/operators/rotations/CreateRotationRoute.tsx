"use client";

import type { Route } from ".react-router/types/app/routes/operations/operators/rotations/+types/CreateRotationRoute";
import { Button } from "flowbite-react";
import { Formik, type FormikErrors, Form as FormikForm, type FormikTouched } from "formik";
import React, { useEffect } from "react";
import { useActionData, useNavigate, useSubmit } from "react-router";
import PilotLicenseInputBlock from "~/components/operator/Form/PilotLicenseInputBlock";
import InputBlock from "~/components/shared/Form/InputBlock";
import Container from "~/components/shared/Layout/Container";
import SectionHeaderWithBackButton from "~/components/shared/Section/SectionHeaderWithBackButton";
import getFormData from "~/functions/getFormData";
import { handleRequestError, handleRequestSuccess } from "~/functions/handleRequest";
import type { CreateRotationRequest } from "~/state/api/request/operator.request";
import { RotationService } from "~/state/api/rotation.service";
import { useToast } from "~/state/app/context/useToast";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";
import { createRotationSchema } from "~/validator/form/rotation.schema";

export async function clientAction({ request, params }: Route.ClientActionArgs) {
  const rotationService = new RotationService();

  const form = await request.formData();
  const rotation = getFormData<CreateRotationRequest>(form, ["name", "pilotId"]);

  return rotationService.create(params.operatorId, rotation).then(handleRequestSuccess).catch(handleRequestError);
}

export default function CreateRotationRoute({ params }: Route.ComponentProps) {
  usePageTitle("Create new rotation");

  const navigate = useNavigate();
  const submit = useSubmit();
  const { error } = useToast();
  const response = useActionData<typeof clientAction>();

  useEffect(() => {
    if (!response) return;

    if (response.isSuccessful) {
      navigate(`/operators/${params.operatorId}/rotations`, {
        viewTransition: true,
        replace: true,
        preventScrollReset: true,
      });
    }
    if (response.isError && response.oneGeneralError) {
      error(response.oneGeneralError);
    }
  }, [response, params.operatorId, navigate, error]);

  const handleSubmit = (values: CreateRotationRequest) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("pilotId", values.pilotId);
    submit(formData, { method: "post" });
  };

  const getErrors = (
    name: keyof CreateRotationRequest,
    formikErrors: FormikErrors<CreateRotationRequest>,
    formikTouched: FormikTouched<CreateRotationRequest>,
  ) => {
    const serverErrors = response?.isError ? response.errorsForKey(name) : [];
    const clientError = formikTouched[name] && formikErrors[name] ? [formikErrors[name]] : [];
    return [...new Set([...clientError, ...serverErrors])];
  };

  return (
    <div className="mx-auto max-w-md pb-4">
      <SectionHeaderWithBackButton
        sectionTitle="Create new rotation"
        backText="Back to operator"
        backUrl={`/operators/${params.operatorId}/rotations`}
      />

      <Formik<CreateRotationRequest>
        initialValues={{ name: "", pilotId: "" }}
        validationSchema={createRotationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors: formikErrors, touched, setFieldValue, handleChange, handleBlur, values }) => (
          <FormikForm noValidate>
            <Container>
              <div className="flex flex-col gap-4">
                <InputBlock
                  htmlName="name"
                  label="Rotation name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={getErrors("name", formikErrors, touched)}
                />
                <PilotLicenseInputBlock
                  htmlName="pilotId"
                  label="Captain pilot license ID"
                  errors={getErrors("pilotId", formikErrors, touched)}
                  setFieldValue={setFieldValue}
                />
              </div>
            </Container>

            <Button type="submit" color="indigo" className="mt-6 w-fit ms-auto">
              Create
            </Button>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
