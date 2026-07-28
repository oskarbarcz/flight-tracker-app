import { useCallback, useEffect, useMemo, useState } from "react";
import { useOnCurrentFlightChange } from "~/features/flight/hooks/useOnCurrentFlightChange";
import { type Rotation, RotationStatus } from "~/features/rotation";
import { useApi } from "~/shared/api/useApi";

type AssignedRotations = {
  active: Rotation[];
  completed: Rotation[];
  loading: boolean;
  refresh: () => void;
};

export function useAssignedRotations(): AssignedRotations {
  const { rotationService } = useApi();
  const [rotations, setRotations] = useState<Rotation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      if (!silent) {
        setLoading(true);
      }
      try {
        setRotations(await rotationService.fetchMine());
      } catch (error) {
        console.error("Cannot fetch assigned rotations", error);
        setRotations([]);
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [rotationService],
  );

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => {
    load({ silent: true });
  }, [load]);

  useOnCurrentFlightChange(refresh);

  return useMemo(() => {
    const released = rotations.filter((rotation) => rotation.status !== RotationStatus.Draft);
    return {
      active: released.filter((rotation) => rotation.isActive),
      completed: released.filter((rotation) => rotation.isFinished || rotation.isCanceled),
      loading,
      refresh,
    };
  }, [rotations, loading, refresh]);
}
