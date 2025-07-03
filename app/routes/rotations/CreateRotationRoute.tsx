"use client";

import React from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Button } from "flowbite-react";
import SectionHeaderWithBackButton from "~/components/SectionHeaderWithBackButton";
import { Form, useActionData, useNavigate } from "react-router";
import getFormData from "~/functions/getFormData";
import { UserRole } from "~/models/user.model";
import InputBlock from "~/components/Form/InputBlock";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import { CreateRotationDto, Rotation } from "~/models";
import { RotationService } from "~/state/api/rotation.service";
import { Route } from "../../../.react-router/types/app/routes/rotations/+types/CreateRotationRoute";
import showFormSubmitErrorToast from "~/components/Toasts/ShowFormSubmitErrorToast";
import {
  handleRequestError,
  handleRequestSuccess,
  ResponseWrapper,
} from "~/functions/handleRequest";

export async function clientAction({
  request,
}: Route.ClientActionArgs): Promise<ResponseWrapper<Rotation>> {
  const rotationService = new RotationService();

  const form = await request.formData();
  const rotation = getFormData<CreateRotationDto>(form, ["name", "pilotId"]);
  return rotationService
    .createNew(rotation)
    .then((response) => handleRequestSuccess(response, "/rotations"))
    .catch((error) => handleRequestError(error));
}

export default function CreateRotationRoute() {
  usePageTitle("Create new rotation");

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
            errors={response?.violations?.name}
          />
          <InputBlock
            htmlName="pilotId"
            label="Pilot ID"
            errors={response?.violations?.pilotId}
          />

          <Button type="submit">Create new rotation</Button>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
