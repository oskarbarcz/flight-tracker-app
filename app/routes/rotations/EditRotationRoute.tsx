"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Button } from "flowbite-react";
import SectionHeaderWithBackButton from "~/components/SectionHeaderWithBackButton";
import { Form, useLoaderData, useActionData, useNavigate } from "react-router";
import { Route } from "../../../.react-router/types/app/routes/rotations/+types/EditRotationRoute";
import InputBlock from "~/components/Form/InputBlock";
import getFormData from "~/functions/getFormData";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import { RotationService } from "~/state/api/rotation.service";
import { EditRotationDto, Rotation } from "~/models";
import {
  handleRequestError,
  handleRequestSuccess,
  ResponseWrapper,
} from "~/functions/handleRequest";
import showFormSubmitErrorToast from "~/components/Toasts/ShowFormSubmitErrorToast";

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs): Promise<ResponseWrapper<Rotation>> {
  const rotationService = new RotationService();

  const form = await request.formData();
  const rotation = getFormData<EditRotationDto>(form, ["name", "pilotId"]);

  return rotationService
    .update(params.id, rotation)
    .then((response) => handleRequestSuccess(response, "/rotations"))
    .catch((error) => handleRequestError(error));
}

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs): Promise<Rotation> {
  const rotationService = new RotationService();

  return rotationService.getById(params.id);
}

export default function EditRotationRoute() {
  usePageTitle("Edit rotation");
  const navigate = useNavigate();
  const response = useActionData<typeof clientAction>();

  React.useEffect(() => {
    if (response?.isSuccessful && response.redirectUrl) {
      navigate(response.redirectUrl);
    }
    if (response?.isError && response.oneGeneralError) {
      showFormSubmitErrorToast(response.oneGeneralError);
    }
  }, [response, navigate]);

  const rotation = useLoaderData<typeof clientLoader>();

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <div className="mx-auto max-w-md pb-4">
        <SectionHeaderWithBackButton
          sectionTitle="Edit rotation"
          backText="Back to rotations"
          backUrl="/rotations"
        />

        <Form className="flex max-w-md flex-col gap-4" method="post">
          <InputBlock
            htmlName="name"
            label="Rotation name"
            defaultValue={rotation.name}
            errors={response?.violations?.name}
          />
          <InputBlock
            htmlName="pilotId"
            label="Pilot ID"
            defaultValue={rotation.pilotId}
            errors={response?.violations?.pilotId}
          />

          <Button type="submit">Save changes</Button>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
