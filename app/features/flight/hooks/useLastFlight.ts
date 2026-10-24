import { useCallback, useEffect, useState } from "react";
import { type Flight, FlightListOrder, FlightListSort, FlightPhase } from "~/features/flight";
import { useApi } from "~/shared/api/useApi";

type Response = {
  lastFlight: Flight | null;
  loading: boolean;
  failed: boolean;
};

export function useLastFlight(): Response {
  const [lastFlight, setLastFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const { flightService } = useApi();

  const fetchLastFlight = useCallback(async () => {
    setLoading(true);
    flightService
      .fetchAllFlights({
        phase: FlightPhase.Finished,
        sort: FlightListSort.ActualOnBlockTime,
        order: FlightListOrder.Descending,
        limit: 1,
      })
      .then((res) => {
        setLastFlight(res.flights[0] ?? null);
        setFailed(false);
      })
      .catch((err) => {
        console.error("Cannot fetch last flight", err);
        setLastFlight(null);
        setFailed(true);
      })
      .finally(() => setLoading(false));
  }, [flightService]);

  useEffect(() => {
    fetchLastFlight();
  }, [fetchLastFlight]);

  return { lastFlight, loading, failed };
}
