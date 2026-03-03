"use client";

import { Route } from ".react-router/types/app/routes/operations/operators/+types/OperatorRotationsRoute";
import React, { JSX, useState } from "react";
import { useLoaderData } from "react-router";
import { RotationListEmptyState } from "~/components/operator/Table/RotationListEmptyState";
import RemoveRotationModal from "~/components/rotation/Modal/RemoveRotationModal";
import RotationListTable from "~/components/rotation/Table/RotationListTable";
import Container from "~/components/shared/Layout/Container";
import { RotationResponse } from "~/models";
import { RotationService } from "~/state/api/rotation.service";
import { useApi } from "~/state/contexts/content/api.context";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const rotations = await new RotationService().fetchAllByOperator(params.id);
  return { operatorId: params.id, rotations };
}

export default function OperatorRotationsRoute(): JSX.Element {
  const { rotationService } = useApi();
  const { operatorId, rotations } = useLoaderData<typeof clientLoader>();

  const [rotationToRemove, setRotationToRemove] =
    useState<RotationResponse | null>(null);

  const removeRotation = async (flightId: string) => {
    await rotationService.remove(flightId);
    setRotationToRemove(null);
  };

  if (rotations.length === 0) {
    return <RotationListEmptyState operatorId={operatorId} />;
  }

  return (
    <div>
      <Container className="overflow-x-auto" padding="none">
        <RotationListTable
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
    </div>
  );
}
