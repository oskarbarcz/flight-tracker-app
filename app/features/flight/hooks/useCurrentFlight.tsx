import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "~/app-state/useAuth";
import { type Flight, FlightStatus } from "~/features/flight";
import { useApi } from "~/shared/api/useApi";

type CurrentFlightContextValue = {
  currentFlight: Flight | null;
  loading: boolean;
  failed: boolean;
  refresh: () => void;
};

const CurrentFlightContext = createContext<CurrentFlightContextValue | null>(null);

export function CurrentFlightProvider({ children }: { children: ReactNode }) {
  const [currentFlight, setCurrentFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const { flightService } = useApi();
  const { user, isLoading: authLoading, refreshUser } = useAuth();
  const currentFlightId = user?.currentFlightId ?? null;

  const loadCurrentFlight = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      if (authLoading) return;
      if (!silent) setLoading(true);
      try {
        if (!currentFlightId) {
          setCurrentFlight(null);
          setFailed(false);
          return;
        }
        const flight = await flightService.fetchById(currentFlightId);
        setCurrentFlight(flight.status === FlightStatus.Closed ? null : flight);
        setFailed(false);
      } catch (error) {
        console.error("Cannot fetch current flight", error);
        setCurrentFlight(null);
        setFailed(true);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [flightService, currentFlightId, authLoading],
  );

  useEffect(() => {
    loadCurrentFlight();
  }, [loadCurrentFlight]);

  const refresh = useCallback(async () => {
    await refreshUser();
    await loadCurrentFlight({ silent: true });
  }, [refreshUser, loadCurrentFlight]);

  const value = useMemo(() => ({ currentFlight, loading, failed, refresh }), [currentFlight, loading, failed, refresh]);

  return <CurrentFlightContext.Provider value={value}>{children}</CurrentFlightContext.Provider>;
}

export function useCurrentFlight(): CurrentFlightContextValue {
  const context = useContext(CurrentFlightContext);
  if (!context) {
    throw new Error("useCurrentFlight must be used within a CurrentFlightProvider");
  }
  return context;
}
