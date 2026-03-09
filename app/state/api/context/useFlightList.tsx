"use client";

import React, { createContext, type ReactNode, useCallback, useContext, useState } from "react";
import type { Flight, FlightPhase } from "~/models";
import { useApi } from "~/state/api/context/useApi";

type FlightListContextType = {
  flights: Flight[];
  loading: boolean;
  totalCount: number;
  limit: number;
  reloadFlights: (phase: FlightPhase, page: number) => void;
};

const UseFlightList = createContext<FlightListContextType | null>(null);

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
    <UseFlightList.Provider
      value={{
        flights,
        loading,
        totalCount,
        limit,
        reloadFlights,
      }}
    >
      {children}
    </UseFlightList.Provider>
  );
}

export function useFlightList() {
  const context = useContext(UseFlightList);
  if (!context) {
    throw new Error("useFlightList must be used within a FlightListProvider");
  }

  return context;
}
