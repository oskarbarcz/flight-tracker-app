import { useCallback, useEffect, useState } from "react";
import { FlightOfp } from "~/models";
import { useApi } from "~/state/contexts/content/api.context";

interface Return {
  ofp: FlightOfp | null;
  loading: boolean;
  error: Error | null;
}

export default function useFlightOfp(flightId: string | null): Return {
  const [ofp, setOfp] = useState<FlightOfp | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { flightService } = useApi();

  const fetchOfp = useCallback(async () => {
    if (!flightId) {
      setOfp(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    flightService
      .getOfpByFlightId(flightId)
      .then(setOfp)
      .catch((err) => {
        const error =
          err instanceof Error ? err : new Error("Failed to fetch OFP");
        console.error("Cannot fetch OFP", error);
        setError(error);
        setOfp(null);
      })
      .finally(() => setLoading(false));
  }, [flightService, flightId]);

  useEffect(() => {
    fetchOfp();
  }, [fetchOfp]);

  return { ofp, loading, error };
}
