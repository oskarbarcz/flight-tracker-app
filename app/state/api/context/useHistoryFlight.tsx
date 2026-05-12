import React, { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import type { Flight, FlightEvent } from "~/models";
import { useApi } from "~/state/api/context/useApi";

type HistoryFlightContextType = {
  flight: Flight | null;
  events: FlightEvent[];
  loading: boolean;
};

const HistoryFlightContext = createContext<HistoryFlightContextType | null>(null);

type Props = {
  flightId: string;
  children: ReactNode;
};

/**
 * Read-only counterpart to {@link TrackedFlightProvider}: fetches the flight
 * and its events once for the history view. No polling, no mutation actions —
 * closed flights don't change. The map tab loads the flight path on demand.
 */
export function HistoryFlightProvider({ flightId, children }: Props) {
  const { flightService } = useApi();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [events, setEvents] = useState<FlightEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([flightService.fetchById(flightId), flightService.fetchEventsByFlightId(flightId)])
      .then(([f, e]) => {
        if (cancelled) return;
        setFlight(f);
        setEvents(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [flightService, flightId]);

  return <HistoryFlightContext.Provider value={{ flight, events, loading }}>{children}</HistoryFlightContext.Provider>;
}

export function useHistoryFlight() {
  const ctx = useContext(HistoryFlightContext);
  if (!ctx) throw new Error("useHistoryFlight must be used within a HistoryFlightProvider");
  return ctx;
}
