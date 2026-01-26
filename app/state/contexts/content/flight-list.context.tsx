"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Flight } from "~/models";
import { useApi } from "~/state/contexts/content/api.context";

type FlightListContextType = {
  flights: Flight[];
  loading: boolean;
  refreshFlights: () => Promise<void>;
};

const FlightListContext = createContext<FlightListContextType | null>(null);

export function FlightListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { flightService } = useApi();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshFlights = useCallback(async () => {
    setLoading(true);
    try {
      const allFlights = await flightService.fetchAllFlights();
      setFlights(allFlights);
    } finally {
      setLoading(false);
    }
  }, [flightService]);

  useEffect(() => {
    refreshFlights();
  }, [refreshFlights]);

  return (
    <FlightListContext.Provider value={{ flights, loading, refreshFlights }}>
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
