import type { Route } from ".react-router/types/app/routes/operations/operators/rotations/+types/OperatorRotationsRoute";
import React, { useState } from "react";
import { useLoaderData } from "react-router";
import { RemoveRotationModal } from "~/features/operator/components/Modal/RemoveRotationModal";
import { RotationListEmptyState } from "~/features/operator/components/Table/EmptyState/RotationListEmptyState";
import { RotationControls } from "~/features/operator/components/Table/RotationControls";
import { RotationListTable } from "~/features/operator/components/Table/RotationListTable";
import type { GetRotationResponse } from "~/features/operator/request";
import { RotationService } from "~/features/rotation/service";
import { useApi } from "~/shared/api/useApi";
import { TransparentContainer } from "~/shared/ui/Layout/TransparentContainer";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const rotations = await new RotationService().fetchAll(params.operatorId);
  return { rotations };
}

export default function OperatorRotationsRoute({ params }: Route.ComponentProps) {
  const { rotationService } = useApi();
  const { rotations } = useLoaderData<typeof clientLoader>();

  const [rotationToRemove, setRotationToRemove] = useState<GetRotationResponse | null>(null);

  const removeRotation = async (rotationId: string) => {
    await rotationService.remove(params.operatorId, rotationId);
    setRotationToRemove(null);
  };

  if (rotations.length === 0) {
    return <RotationListEmptyState operatorId={params.operatorId} />;
  }

  return (
    <>
      <RotationControls operatorId={params.operatorId} />
      <TransparentContainer className="overflow-x-auto">
        <RotationListTable operatorId={params.operatorId} rotations={rotations} removeRotation={setRotationToRemove} />
      </TransparentContainer>

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
