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

  const fetchCurrentFlight = useCallback(async () => {
    setLoading(true);

    if (!user.currentFlightId) {
      setCurrentFlight(null);
      setLoading(false);

      return;
    }

    flightService
      .getById(user.currentFlightId)
      .then(setCurrentFlight)
      .catch((err) => {
        console.error("Cannot fetch current flight", err);
        setCurrentFlight(null);
      })
      .finally(() => setLoading(false));
  }, [flightService, user.currentFlightId]);

  useEffect(() => {
    fetchCurrentFlight();
  }, [fetchCurrentFlight]);

  return { currentFlight, loading };
}
