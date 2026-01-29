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
  totalCount: number;
  limit: number;
  reloadFlights: (phase: FlightPhase, page: number) => void;
};

const FlightListContext = createContext<FlightListContextType | null>(null);

type FlightListProviderProps = {
  children: ReactNode;
};

export function FlightListProvider({ children }: FlightListProviderProps) {
  const { flightService } = useApi();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  const reloadFlights = useCallback(
    (phase: FlightPhase, pageToLoad: number) => {
      setLoading(true);
      flightService
        .fetchAllFlights({ phase, page: pageToLoad, limit })
        .then((response) => {
          setFlights(response.flights);
          setTotalCount(response.totalCount);
        })
        .finally(() => setLoading(false));
    },
    [flightService],
  );

  return (
    <FlightListContext.Provider
      value={{
        flights,
        loading,
        totalCount,
        limit,
        reloadFlights,
      }}
    >
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
