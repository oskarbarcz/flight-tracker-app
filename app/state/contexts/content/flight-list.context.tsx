"use client";

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { Flight, FlightPhase } from "~/models";
import { useApi } from "~/state/contexts/content/api.context";

type FlightListContextType = {
  flights: Flight[];
  loading: boolean;
  reloadFlights: (phase: FlightPhase) => void;
};

const FlightListContext = createContext<FlightListContextType | null>(null);

type FlightListProviderProps = {
  children: ReactNode;
};

export function FlightListProvider({ children }: FlightListProviderProps) {
  const { flightService } = useApi();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);

  const reloadFlights = useCallback(
    (phase: FlightPhase) => {
      setLoading(true);
      flightService
        .fetchAllFlights({ phase })
        .then(setFlights)
        .then(() => setLoading(false));
    },
    [flightService],
  );

  return (
    <FlightListContext.Provider value={{ flights, loading, reloadFlights }}>
      {children}
    </FlightListContext.Provider>
  );
}

export function useFlightList() {
  const context = useContext(FlightListContext);
  if (!context) {
    throw new Error("useFlightList must be used within a FlightListProvider");
  }

  return context;
}
