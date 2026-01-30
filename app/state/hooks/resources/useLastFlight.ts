import { useCallback, useEffect, useState } from "react";
import { Flight, FlightPhase } from "~/models";
import { useApi } from "~/state/contexts/content/api.context";

type Response = {
  lastFlight: Flight | null;
  loading: boolean;
};

export default function useLastFlight(): Response {
  const [lastFlight, setLastFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const { flightService } = useApi();

  const fetchLastFlight = useCallback(async () => {
    setLoading(true);
    flightService
      .fetchAllFlights({ phase: FlightPhase.Finished, limit: 1 })
      .then((res) => setLastFlight(res.flights[0] ?? null))
      .catch((err) => {
        console.error("Cannot fetch last flight", err);
        setLastFlight(null);
      })
      .finally(() => setLoading(false));
  }, [flightService]);

  useEffect(() => {
    fetchLastFlight();
  }, [fetchLastFlight]);

  return { lastFlight, loading };
}
