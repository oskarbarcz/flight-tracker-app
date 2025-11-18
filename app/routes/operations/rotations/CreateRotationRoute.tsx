"use client";

import { Button } from "flowbite-react";
import React, { useEffect } from "react";
import { Form, useActionData, useNavigate } from "react-router";
import PilotLicenseInputBlock from "~/components/rotation/Form/PilotLicenseInputBlock";
import InputBlock from "~/components/shared/Form/InputBlock";
import SectionHeaderWithBackButton from "~/components/shared/Section/SectionHeaderWithBackButton";
import showFormSubmitErrorToast from "~/components/shared/Toasts/ShowFormSubmitErrorToast";
import getFormData from "~/functions/getFormData";
import {
  handleRequestError,
  handleRequestSuccess,
  ResponseWrapper,
} from "~/functions/handleRequest";
import { CreateRotationRequest, RotationResponse } from "~/models";
import { UserRole } from "~/models/user.model";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { RotationService } from "~/state/api/rotation.service";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import { Route } from "../../../../.react-router/types/app/routes/operations/rotations/+types/CreateRotationRoute";

type CreateRotationResponse = ResponseWrapper<
  CreateRotationRequest,
  RotationResponse
>;

export async function clientAction({
  request,
}: Route.ClientActionArgs): Promise<CreateRotationResponse> {
  const rotationService = new RotationService();

  const form = await request.formData();
  const rotation = getFormData<CreateRotationRequest>(form, [
    "name",
    "pilotId",
  ]);
  return rotationService
    .createNew(rotation)
    .then((response) => handleRequestSuccess(response, "/rotations"))
    .catch((error) => handleRequestError(error));
}

export default function CreateRotationRoute() {
  usePageTitle("Create new rotation");

  const navigate = useNavigate();
  const response = useActionData<typeof clientAction>();

  useEffect(() => {
    if (response?.isSuccessful) {
      navigate(response.redirectUrl, { viewTransition: true });
    }
    if (response?.isError && response.oneGeneralError) {
      showFormSubmitErrorToast(response.oneGeneralError);
    }
  }, [response, navigate]);

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <div className="mx-auto max-w-md pb-4">
        <SectionHeaderWithBackButton
          sectionTitle="Create new rotation"
          backText="Back to rotations"
          backUrl="/rotations"
        />

        <Form className="flex max-w-md flex-col gap-4" method="post">
          <InputBlock
            htmlName="name"
            label="Rotation name"
            errors={response?.isError ? response.errorsForKey("name") : []}
          />
          <PilotLicenseInputBlock
            htmlName="pilotId"
            label="Captain pilot license ID"
            errors={response?.isError ? response.errorsForKey("pilotId") : []}
          />

          <Button type="submit">Create new rotation</Button>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
