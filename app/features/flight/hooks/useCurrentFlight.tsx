import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "~/app-state/useAuth";
import type { Flight } from "~/features/flight";
import type { User } from "~/features/user";
import { useApi } from "~/shared/api/useApi";

type CurrentFlightContextValue = {
  currentFlight: Flight | null;
  loading: boolean;
};

const CurrentFlightContext = createContext<CurrentFlightContextValue | null>(null);

export function CurrentFlightProvider({ children }: { children: ReactNode }) {
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
      .fetchById(user.currentFlightId)
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

  const value = useMemo(() => ({ currentFlight, loading }), [currentFlight, loading]);

  return <CurrentFlightContext.Provider value={value}>{children}</CurrentFlightContext.Provider>;
}

export function useCurrentFlight(): CurrentFlightContextValue {
  const context = useContext(CurrentFlightContext);
  if (!context) {
    throw new Error("useCurrentFlight must be used within a CurrentFlightProvider");
  }
  return context;
}
