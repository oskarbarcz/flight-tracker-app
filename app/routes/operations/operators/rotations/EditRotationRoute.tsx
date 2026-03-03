"use client";

import { Route } from ".react-router/types/app/routes/operations/operators/rotations/+types/EditRotationRoute";
import { Button } from "flowbite-react";
import React, { useEffect } from "react";
import { Form, useActionData, useLoaderData, useNavigate } from "react-router";
import PilotLicenseInputBlock from "~/components/operator/Form/PilotLicenseInputBlock";
import RotationFlightsInputBlock from "~/components/operator/Form/RotationFlightsInputBlock";
import InputBlock from "~/components/shared/Form/InputBlock";
import SectionHeaderWithBackButton from "~/components/shared/Section/SectionHeaderWithBackButton";
import getFormData from "~/functions/getFormData";
import {
  handleRequestError,
  handleRequestSuccess,
  ResponseWrapper,
} from "~/functions/handleRequest";
import { EditRotationRequest, RotationResponse } from "~/models";
import { UserRole } from "~/models/user.model";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { RotationService } from "~/state/api/rotation.service";
import { useToast } from "~/state/contexts/global/toast.context";
import { usePageTitle } from "~/state/hooks/usePageTitle";

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
    .update(params.rotationId, rotation)
    .then((response) => handleRequestSuccess(response, "/rotations"))
    .catch((error) => handleRequestError(error));
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const rotation = await new RotationService().getById(params.rotationId);
  return { operatorId: params.operatorId, rotation };
}

export default function EditRotationRoute() {
  usePageTitle("Edit rotation");
  const navigate = useNavigate();
  const { error } = useToast();
  const { operatorId, rotation } = useLoaderData<typeof clientLoader>();
  const response = useActionData<typeof clientAction>();

  useEffect(() => {
    if (response?.isSuccessful) {
      navigate(response.redirectUrl, { viewTransition: true });
    }
    if (response?.isError && response.oneGeneralError) {
      error(response.oneGeneralError);
    }
  }, [response, navigate, error]);

  const updateLegs = async () => {
    const rotationService = new RotationService();
    await rotationService.getById(rotation.id);
  };

  return (
    <ProtectedRoute expectedRole={UserRole.Operations}>
      <div className="mx-auto max-w-md pb-4">
        <SectionHeaderWithBackButton
          sectionTitle="Edit rotation"
          backText="Back to operator"
          backUrl={`/operators/${operatorId}/rotations`}
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
            updateLegs={updateLegs}
          />

          <Button type="submit" color="indigo">
            Save changes
          </Button>
        </Form>
      </div>
    </ProtectedRoute>
  );
}
