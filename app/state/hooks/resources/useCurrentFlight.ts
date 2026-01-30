import { useCallback, useEffect, useState } from "react";
import { Flight, User } from "~/models";
import { useApi } from "~/state/contexts/content/api.context";
import { useAuth } from "~/state/contexts/session/auth.context";

type Response = {
  currentFlight: Flight | null;
  loading: boolean;
};

export default function useCurrentFlight(): Response {
  const [currentFlight, setCurrentFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const { flightService } = useApi();
  const { user } = useAuth() as { user: User };

  const fetchLastFlight = useCallback(async () => {
    setLoading(true);

    if (!user.currentFlightId) {
      setCurrentFlight(null);
      return;
    }

    flightService
      .getById(user.currentFlightId)
      .then(setCurrentFlight)
      .finally(() => setLoading(false));
  }, [flightService, user.currentFlightId]);

  useEffect(() => {
    fetchLastFlight();
  }, [fetchLastFlight]);

  return { currentFlight, loading };
}
