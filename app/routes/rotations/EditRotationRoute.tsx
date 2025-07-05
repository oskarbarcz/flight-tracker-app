"use client";

import React, { useEffect } from "react";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { Button } from "flowbite-react";
import SectionHeaderWithBackButton from "~/components/SectionHeaderWithBackButton";
import {
  Form,
  useLoaderData,
  useActionData,
  redirect,
  useNavigate,
} from "react-router";
import { Route } from "../../../.react-router/types/app/routes/rotations/+types/EditRotationRoute";
import InputBlock from "~/components/BaseComponents/Form/InputBlock";
import getFormData from "~/functions/getFormData";
import { UserRole } from "~/models/user.model";
import { usePageTitle } from "~/state/hooks/usePageTitle";
import { RotationService } from "~/state/api/rotation.service";
import { EditRotationRequest, RotationResponse } from "~/models";
import {
  handleRequestError,
  handleRequestSuccess,
  ResponseWrapper,
} from "~/functions/handleRequest";
import showFormSubmitErrorToast from "~/components/Toasts/ShowFormSubmitErrorToast";
import PilotLicenseInputBlock from "~/components/Form/PilotLicenseInputBlock";
import RotationFlightsInputBlock from "~/components/Form/RotationFlightsInputBlock";

type EditRotationResponse = ResponseWrapper<
  EditRotationRequest,
  RotationResponse
>;

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs): Promise<EditRotationResponse> {
  const rotationService = new RotationService();

  const form = await request.formData();
  const rotation = getFormData<EditRotationRequest>(form, ["name", "pilotId"]);

  return rotationService
    .update(params.id, rotation)
    .then((response) => handleRequestSuccess(response, "/rotations"))
    .catch((error) => handleRequestError(error));
}

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs): Promise<RotationResponse | Response> {
  try {
    const rotationService = new RotationService();
    return await rotationService.getById(params.id);
  } catch {
    return redirect("/rotations");
  }
}

export default function EditRotationRoute() {
  usePageTitle("Edit rotation");
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
            errors={response?.isError ? response.errorsForKey("name") : []}
          />
          <PilotLicenseInputBlock
            htmlName="pilotId"
            label="Captain pilot license ID"
            defaultValue={rotation.pilot.id}
            errors={response?.isError ? response.errorsForKey("pilotId") : []}
          />
          <RotationFlightsInputBlock
            rotation={rotation}
            legs={rotation.flights}
          />

          <Button type="submit">Save changes</Button>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
