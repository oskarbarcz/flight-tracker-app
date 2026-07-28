import { useMemo } from "react";
import { type Rotation, RotationStatus } from "~/features/rotation";
import { useAssignedRotations } from "~/features/rotation/hooks/useAssignedRotations";

export function useRotationForFlight(flightId: string | null): Rotation | null {
  const { active } = useAssignedRotations();

  return useMemo(() => {
    if (!flightId) {
      return null;
    }
    return (
      active.find((rotation) => rotation.status === RotationStatus.InProgress && rotation.containsFlight(flightId)) ??
      null
    );
  }, [active, flightId]);
}
