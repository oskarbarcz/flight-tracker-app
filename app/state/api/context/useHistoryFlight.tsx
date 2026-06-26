import React, { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import type { Diversion, Flight, FlightEvent } from "~/models";
import { useApi } from "~/state/api/context/useApi";

type HistoryFlightContextType = {
  flight: Flight | null;
  events: FlightEvent[];
  diversion: Diversion | null;
  loading: boolean;
};

const HistoryFlightContext = createContext<HistoryFlightContextType | null>(null);

type Props = {
  flightId: string;
  children: ReactNode;
};

export function HistoryFlightProvider({ flightId, children }: Props) {
  const { flightService, diversionService } = useApi();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [events, setEvents] = useState<FlightEvent[]>([]);
  const [diversion, setDiversion] = useState<Diversion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    flightService
      .fetchById(flightId)
      .then(async (f) => {
        if (cancelled) return;
        setFlight(f);
        const [e, d] = await Promise.all([
          flightService.fetchEventsByFlightId(flightId),
          f.isFlightDiverted ? diversionService.getByFlight(flightId) : Promise.resolve(null),
        ]);
        if (cancelled) return;
        setEvents(e);
        setDiversion(d);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [flightService, diversionService, flightId]);

  return (
    <HistoryFlightContext.Provider value={{ flight, events, diversion, loading }}>
      {children}
    </HistoryFlightContext.Provider>
  );
}

export function useHistoryFlight() {
  const ctx = useContext(HistoryFlightContext);
  if (!ctx) throw new Error("useHistoryFlight must be used within a HistoryFlightProvider");
  return ctx;
}
