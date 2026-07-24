import type { Route } from ".react-router/types/app/routes/operations/operators/rotations/+types/RotationDetailsRoute";
import React from "react";
import { useLoaderData } from "react-router";
import { AirportService } from "~/features/airport/service";
import { RotationDetails } from "~/features/rotation/components/RotationDetails";
import { RotationService } from "~/features/rotation/service";
import { UserService } from "~/features/user/service";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const [rotation, airports] = await Promise.all([
    new RotationService().fetchById(params.rotationId),
    new AirportService().fetchAll(),
  ]);
  const pilot = await new UserService().fetchUserById(rotation.pilotId).catch(() => null);

  return { rotation, airports, operatorId: params.operatorId, pilotName: pilot?.name ?? null };
}

export default function RotationDetailsRoute() {
  const { rotation, airports, operatorId, pilotName } = useLoaderData<typeof clientLoader>();
  usePageTitle(rotation.name);

  return (
    <RotationDetails initialRotation={rotation} airports={airports} operatorId={operatorId} pilotName={pilotName} />
  );
}
