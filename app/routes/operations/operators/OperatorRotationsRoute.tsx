"use client";

import React, {useState} from "react";
import { useLoaderData } from "react-router";
import { RotationService } from "~/state/api/rotation.service";
import {Route} from ".react-router/types/app/routes/operations/operators/+types/OperatorRotationsRoute";
import {RotationResponse} from "~/models";
import Container from "~/components/shared/Layout/Container";
import RotationListTable from "~/components/rotation/Table/RotationListTable";
import RemoveRotationModal from "~/components/rotation/Modal/RemoveRotationModal";
import {useApi} from "~/state/contexts/content/api.context";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const rotations = await new RotationService().fetchAllByOperator(params.id);
  return { rotations };
}

export default function OperatorRotationsRoute() {
  const { rotationService } = useApi();
  const { rotations } = useLoaderData<typeof clientLoader>();

  const [rotationToRemove, setRotationToRemove] =
    useState<RotationResponse | null>(null);

  const removeRotation = async (flightId: string) => {
    await rotationService.remove(flightId);
    setRotationToRemove(null);
  };

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
