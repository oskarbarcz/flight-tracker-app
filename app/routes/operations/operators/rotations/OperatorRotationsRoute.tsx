"use client";

import type { Route } from ".react-router/types/app/routes/operations/operators/rotations/+types/OperatorRotationsRoute";
import React, { type JSX, useState } from "react";
import { useLoaderData } from "react-router";
import RemoveRotationModal from "~/components/operator/Modal/RemoveRotationModal";
import { RotationListEmptyState } from "~/components/operator/Table/EmptyState/RotationListEmptyState";
import RotationControls from "~/components/operator/Table/RotationControls";
import RotationListTable from "~/components/operator/Table/RotationListTable";
import Container from "~/components/shared/Layout/Container";
import type { RotationResponse } from "~/models";
import { RotationService } from "~/state/api/rotation.service";
import { useApi } from "~/state/contexts/content/api.context";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const rotations = await new RotationService().fetchAll(params.operatorId);
  return { rotations };
}

export default function OperatorRotationsRoute({
  params,
}: Route.ComponentProps): JSX.Element {
  const { rotationService } = useApi();
  const { rotations } = useLoaderData<typeof clientLoader>();

  const [rotationToRemove, setRotationToRemove] =
    useState<RotationResponse | null>(null);

  const removeRotation = async (flightId: string) => {
    await rotationService.remove(flightId);
    setRotationToRemove(null);
  };

  if (rotations.length === 0) {
    return <RotationListEmptyState operatorId={params.operatorId} />;
  }

  return (
    <>
      <RotationControls operatorId={params.operatorId} />
      <Container className="overflow-x-auto" padding="none">
        <RotationListTable
          operatorId={params.operatorId}
          rotations={rotations}
          removeRotation={setRotationToRemove}
        />
      </Container>

      {rotationToRemove && (
        <RemoveRotationModal
          rotation={rotationToRemove}
          remove={removeRotation}
          cancel={() => setRotationToRemove(null)}
        />
      )}
    </>
  );
}
