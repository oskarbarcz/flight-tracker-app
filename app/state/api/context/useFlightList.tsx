import React, { createContext, type ReactNode, useCallback, useContext, useState } from "react";
import { useDataRefresh } from "~/app-state/useDataRefresh";
import { type Flight, FlightPhase } from "~/models";
import { useApi } from "~/shared/api/useApi";

type FlightListContextType = {
  flights: Flight[];
  loading: boolean;
  totalCount: number;
  emergencyCount: number;
  limit: number;
  reloadFlights: (phase: FlightPhase | FlightPhase[], page: number) => void;
};

const UseFlightList = createContext<FlightListContextType | null>(null);

type FlightListProviderProps = {
  children: ReactNode;
  limit?: number;
};

export function FlightListProvider({ children, limit = 10 }: FlightListProviderProps) {
  const { flightService } = useApi();
  const { markRefreshed } = useDataRefresh();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [emergencyCount, setEmergencyCount] = useState(0);

  const reloadFlights = useCallback(
    (phase: FlightPhase | FlightPhase[], pageToLoad: number) => {
      const phases = Array.isArray(phase) ? phase : [phase];
      setLoading(true);
      Promise.all([
        ...phases.map((p) => flightService.fetchAllFlights({ phase: p, page: pageToLoad, limit })),
        flightService.fetchAllFlights({ phase: FlightPhase.Emergency, page: 1, limit: 1 }),
      ])
        .then((responses) => {
          const emergencyResponse = responses[responses.length - 1];
          const listResponses = responses.slice(0, -1);

          const merged: Flight[] = [];
          const seen = new Set<string>();
          for (const response of listResponses) {
            for (const flight of response.flights) {
              if (seen.has(flight.id)) continue;
              seen.add(flight.id);
              merged.push(flight);
            }
          }

          setFlights(merged);
          setTotalCount(listResponses.length === 1 ? listResponses[0].totalCount : merged.length);
          setEmergencyCount(emergencyResponse.totalCount);
          markRefreshed();
        })
        .finally(() => setLoading(false));
    },
    [flightService, markRefreshed, limit],
  );

  return (
    <UseFlightList.Provider
      value={{
        flights,
        loading,
        totalCount,
        emergencyCount,
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
