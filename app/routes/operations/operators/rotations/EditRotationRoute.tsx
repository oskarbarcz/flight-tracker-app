"use client";

import { Route } from ".react-router/types/app/routes/operations/operators/rotations/+types/EditRotationRoute";
import { Button } from "flowbite-react";
import React, { useEffect } from "react";
import { Form, useActionData, useLoaderData, useNavigate } from "react-router";
import PilotLicenseInputBlock from "~/components/operator/Form/PilotLicenseInputBlock";
import RotationFlightsInputBlock from "~/components/operator/Form/RotationFlightsInputBlock";
import InputBlock from "~/components/shared/Form/InputBlock";
import Container from "~/components/shared/Layout/Container";
import SectionHeaderWithBackButton from "~/components/shared/Section/SectionHeaderWithBackButton";
import getFormData from "~/functions/getFormData";
import {
  handleRequestError,
  handleRequestSuccess,
} from "~/functions/handleRequest";
import { EditRotationRequest, RotationResponse } from "~/models";
import { UserRole } from "~/models/user.model";
import ProtectedRoute from "~/routes/common/ProtectedRoute";
import { RotationService } from "~/state/api/rotation.service";
import { useToast } from "~/state/contexts/global/toast.context";
import { usePageTitle } from "~/state/hooks/usePageTitle";

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs) {
  const rotationService = new RotationService();

  const form = await request.formData();
  const rotation = getFormData<EditRotationRequest>(form, ["name", "pilotId"]);

  return rotationService
    .update(params.rotationId, rotation)
    .then(handleRequestSuccess)
    .catch(handleRequestError);
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const rotation = await new RotationService().getById(params.rotationId);
  return { rotation };
}

export default function EditRotationRoute({ params }: Route.ComponentProps) {
  usePageTitle("Edit rotation");
  const navigate = useNavigate();
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
    await rotationService.getById(rotation.id);
  };

  return (
    <div className="mx-auto max-w-md pb-4">
      <SectionHeaderWithBackButton
        sectionTitle="Edit rotation"
        backText="Back to operator"
        backUrl={`/operators/${params.operatorId}/rotations`}
      />

      <Form method="post">
        <Container>
          <div className="flex flex-col gap-4">
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
          </div>
        </Container>

        <Button type="submit" color="indigo" className="mt-6 w-fit ms-auto">
          Save changes
        </Button>
      </Form>
    </div>
  );
}
