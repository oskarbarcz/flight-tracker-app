"use client";

import type { Route } from ".react-router/types/app/routes/operations/operators/rotations/+types/EditRotationRoute";
import { Button } from "flowbite-react";
import { Formik, type FormikErrors, Form as FormikForm, type FormikTouched } from "formik";
import React, { useEffect } from "react";
import { useActionData, useLoaderData, useNavigate, useSubmit } from "react-router";
import { PilotLicenseInputBlock } from "~/components/operator/Form/PilotLicenseInputBlock";
import { RotationFlightsInputBlock } from "~/components/operator/Form/RotationFlightsInputBlock";
import { InputBlock } from "~/components/shared/Form/InputBlock";
import { Container } from "~/components/shared/Layout/Container";
import { SectionHeaderWithBackButton } from "~/components/shared/Section/SectionHeaderWithBackButton";
import getFormData from "~/functions/getFormData";
import { handleRequestError, handleRequestSuccess } from "~/functions/handleRequest";
import type { EditRotationRequest } from "~/state/api/request/operator.request";
import { RotationService } from "~/state/api/rotation.service";
import { useToast } from "~/state/app/context/useToast";
import { usePageTitle } from "~/state/app/hooks/usePageTitle";
import { createRotationSchema } from "~/validator/form/rotation.schema";

export async function clientAction({ request, params }: Route.ClientActionArgs) {
  const rotationService = new RotationService();

  const form = await request.formData();
  const rotation = getFormData<EditRotationRequest>(form, ["name", "pilotId"]);

  return rotationService.update(params.rotationId, rotation).then(handleRequestSuccess).catch(handleRequestError);
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const rotation = await new RotationService().fetchById(params.rotationId);
  return { rotation };
}

export default function EditRotationRoute({ params }: Route.ComponentProps) {
  usePageTitle("Edit rotation");
  const navigate = useNavigate();
  const submit = useSubmit();
  const { error } = useToast();
  const { rotation } = useLoaderData<typeof clientLoader>();

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
  }, [response, navigate, error, params.operatorId]);

  const updateLegs = async () => {
    const rotationService = new RotationService();
    await rotationService.fetchById(rotation.id);
  };

  const handleSubmit = (values: EditRotationRequest) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("pilotId", values.pilotId);
    submit(formData, { method: "post" });
  };

  const getErrors = (
    name: keyof EditRotationRequest,
    formikErrors: FormikErrors<EditRotationRequest>,
    formikTouched: FormikTouched<EditRotationRequest>,
  ) => {
    const serverErrors = response?.isError ? response.errorsForKey(name) : [];
    const clientError = formikTouched[name] && formikErrors[name] ? [formikErrors[name]] : [];
    return [...new Set([...clientError, ...serverErrors])];
  };

  return (
    <div className="mx-auto max-w-md pb-4">
      <SectionHeaderWithBackButton
        sectionTitle="Edit rotation"
        backText="Back to operator"
        backUrl={`/operators/${params.operatorId}/rotations`}
      />

      <Formik<EditRotationRequest>
        initialValues={{
          name: rotation.name,
          pilotId: rotation.pilot.id,
        }}
        validationSchema={createRotationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, setFieldValue, handleChange, handleBlur, values }) => (
          <FormikForm noValidate>
            <Container>
              <div className="flex flex-col gap-4">
                <InputBlock
                  htmlName="name"
                  label="Rotation name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errors={getErrors("name", errors, touched)}
                />
                <PilotLicenseInputBlock
                  htmlName="pilotId"
                  label="Captain pilot license ID"
                  defaultValue={rotation.pilot.id}
                  errors={getErrors("pilotId", errors, touched)}
                  setFieldValue={setFieldValue}
                />
                <RotationFlightsInputBlock rotation={rotation} legs={rotation.flights} updateLegs={updateLegs} />
              </div>
            </Container>

            <Button type="submit" color="indigo" className="mt-6 w-fit ms-auto">
              Save changes
            </Button>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
