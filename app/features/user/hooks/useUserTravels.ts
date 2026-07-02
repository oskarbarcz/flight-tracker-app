import { useCallback, useEffect, useState } from "react";
import { useAuth } from "~/app-state/useAuth";
import type { UserTravel, UserTravelAirport } from "~/features/travel";
import { useApi } from "~/shared/api/useApi";

type Response = {
  travels: UserTravel[];
  latestTravel: UserTravel | null;
  currentLocation: UserTravelAirport | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

export function useUserTravels(): Response {
  const { travelService } = useApi();
  const { user } = useAuth();
  const [travels, setTravels] = useState<UserTravel[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await travelService.listByUser(user.id);
      setTravels([...result].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    } catch (err) {
      console.error("Cannot fetch user travels", err);
      setTravels([]);
    } finally {
      setLoading(false);
    }
  }, [travelService, user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const latestTravel = travels[0] ?? null;
  const currentLocation = latestTravel?.isFinished ? latestTravel.destinationAirport : null;

  return { travels, latestTravel, currentLocation, loading, refresh };
}
