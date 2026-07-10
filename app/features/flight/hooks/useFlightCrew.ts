import { useCallback, useEffect, useState } from "react";
import type { CrewMember } from "~/features/flight";
import { useApi } from "~/shared/api/useApi";

type Response = {
  crew: CrewMember[];
  loading: boolean;
};

export function useFlightCrew(flightId: string): Response {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { flightService } = useApi();

  const fetchCrew = useCallback(async () => {
    setLoading(true);
    flightService
      .fetchCrewByFlightId(flightId)
      .then(setCrew)
      .catch((err) => {
        console.error("Cannot fetch flight crew", err);
        setCrew([]);
      })
      .finally(() => setLoading(false));
  }, [flightService, flightId]);

  useEffect(() => {
    fetchCrew();
  }, [fetchCrew]);

  return { crew, loading };
}
