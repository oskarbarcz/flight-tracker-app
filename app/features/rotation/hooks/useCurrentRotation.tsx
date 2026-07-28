import { useMemo } from "react";
import { type Rotation, RotationStatus } from "~/features/rotation";
import { useAssignedRotations } from "~/features/rotation/hooks/useAssignedRotations";

type CurrentRotation = {
  rotation: Rotation | null;
  loading: boolean;
};

function firstLegStart(rotation: Rotation): number {
  return rotation.firstLeg?.offBlockTime.getTime() ?? Number.POSITIVE_INFINITY;
}

export function useCurrentRotation(): CurrentRotation {
  const { active, loading } = useAssignedRotations();

  const rotation = useMemo(() => {
    const inProgress = active.filter((candidate) => candidate.status === RotationStatus.InProgress);
    const candidates = inProgress.length > 0 ? inProgress : active;
    return [...candidates].sort((a, b) => firstLegStart(a) - firstLegStart(b))[0] ?? null;
  }, [active]);

  return { rotation, loading };
}
