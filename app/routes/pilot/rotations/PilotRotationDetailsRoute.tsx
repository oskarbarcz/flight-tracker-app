import type { Route } from ".react-router/types/app/routes/pilot/rotations/+types/PilotRotationDetailsRoute";
import React from "react";
import { useLoaderData } from "react-router";
import { useAuth } from "~/app-state/useAuth";
import { AirportService } from "~/features/airport/service";
import { OperatorService } from "~/features/operator/service";
import { PilotRotationDetails } from "~/features/rotation/components/PilotRotationDetails";
import { PilotRotationUnavailable } from "~/features/rotation/components/PilotRotationUnavailable";
import { RotationService } from "~/features/rotation/service";
import { usePageTitle } from "~/shared/hooks/usePageTitle";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const rotation = await new RotationService().fetchById(params.rotationId).catch(() => null);

  if (!rotation) {
    return { rotation: null, airports: [], operator: null };
  }

  const [airports, operator] = await Promise.all([
    new AirportService().fetchAll(),
    new OperatorService().fetchById(rotation.operatorId).catch(() => null),
  ]);

  return { rotation, airports, operator };
}

export default function PilotRotationDetailsRoute() {
  const { rotation, airports, operator } = useLoaderData<typeof clientLoader>();
  const { user } = useAuth();
  usePageTitle(rotation?.name ?? "Rotation");

  if (!rotation) {
    return <PilotRotationUnavailable hint="This rotation could not be found." />;
  }

  if (user && rotation.pilotId !== user.id) {
    return <PilotRotationUnavailable hint="This rotation is not assigned to you." />;
  }

  if (rotation.isDraft) {
    return (
      <PilotRotationUnavailable hint="This rotation is still being planned and has not been released to you yet." />
    );
  }

  return <PilotRotationDetails rotation={rotation} airports={airports} operator={operator} />;
}
