import { useCallback, useEffect, useState } from "react";
import type { FlightOfp } from "~/features/flight";
import { usePublicApi } from "~/shared/api/usePublicApi";

interface Return {
  ofp: FlightOfp | null;
  loading: boolean;
  error: Error | null;
}

export function usePublicFlightOfp(flightId: string | null): Return {
  const [ofp, setOfp] = useState<FlightOfp | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { publicFlightService } = usePublicApi();

  const fetchOfp = useCallback(async () => {
    if (!flightId) {
      setOfp(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    publicFlightService
      .fetchOfpByFlightId(flightId)
      .then(setOfp)
      .catch((err) => {
        const error = err instanceof Error ? err : new Error("Failed to fetch OFP");
        setError(error);
        setOfp(null);
      })
      .finally(() => setLoading(false));
  }, [publicFlightService, flightId]);

  useEffect(() => {
    fetchOfp();
  }, [fetchOfp]);

  return { ofp, loading, error };
}
