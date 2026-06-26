import { useCallback, useEffect, useState } from "react";
import type { UserTravel, UserTravelAirport } from "~/models";
import { useApi } from "~/state/api/context/useApi";
import { useAuth } from "~/state/api/context/useAuth";

type Response = {
  travels: UserTravel[];
  latestTravel: UserTravel | null;
  currentLocation: UserTravelAirport | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

export default function useUserTravels(): Response {
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
