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
  page: number;
  limit: number;
  setPage: (page: number) => void;
  reloadFlights: (phase: FlightPhase, page: number) => void;
};

const FlightListContext = createContext<FlightListContextType | null>(null);

type FlightListProviderProps = {
  children: ReactNode;
};

export function FlightListProvider({ children }: FlightListProviderProps) {
  const { flightService } = useApi();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
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

  const handleSetPage = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <FlightListContext.Provider
      value={{
        flights,
        loading,
        totalCount,
        page,
        limit,
        setPage: handleSetPage,
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
