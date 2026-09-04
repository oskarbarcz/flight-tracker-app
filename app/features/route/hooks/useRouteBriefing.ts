import { useEffect, useState } from "react";
import type { Airport } from "~/features/airport/model";
import type { EtopsBriefing } from "~/features/route/model";
import { isNotFound } from "~/shared/api/api.service";
import { useApi } from "~/shared/api/useApi";

type Return = {
  briefing: EtopsBriefing | null;
  airports: Map<string, Airport>;
  loading: boolean;
  error: Error | null;
};

const NO_AIRPORTS: Map<string, Airport> = new Map();

function referencedAirportIds(briefing: EtopsBriefing): string[] {
  const plan = briefing.etops;

  if (plan === null) {
    return [];
  }

  const referenced = [
    ...plan.airports.map((airport) => airport.airportId),
    ...plan.points.flatMap((point) => [
      point.adequateAirportId,
      ...point.diversionAirports.map((airport) => airport.airportId),
    ]),
  ];

  return [...new Set(referenced.filter((id): id is string => id !== null))];
}

export function useRouteBriefing(flightId: string | null): Return {
  const { flightService, airportService } = useApi();
  const [briefing, setBriefing] = useState<EtopsBriefing | null>(null);
  const [airports, setAirports] = useState<Map<string, Airport>>(NO_AIRPORTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (flightId === null) {
      setBriefing(null);
      setAirports(NO_AIRPORTS);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    flightService
      .fetchEtopsBriefingByFlightId(flightId)
      .then(async (fetched) => {
        if (cancelled) {
          return;
        }

        setBriefing(fetched);

        const ids = referencedAirportIds(fetched);
        const settled = await Promise.allSettled(ids.map((id) => airportService.fetchById(id)));

        if (cancelled) {
          return;
        }

        const resolved = new Map<string, Airport>();
        settled.forEach((result, index) => {
          if (result.status === "fulfilled") {
            resolved.set(ids[index], result.value);
          }
        });
        setAirports(resolved);
      })
      .catch((reason: unknown) => {
        if (cancelled) {
          return;
        }

        setBriefing(null);
        setAirports(NO_AIRPORTS);

        if (isNotFound(reason)) {
          setError(null);
          return;
        }

        const failure = reason instanceof Error ? reason : new Error("Failed to fetch the planned route");
        console.error("Cannot fetch route briefing", failure);
        setError(failure);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [flightId, flightService, airportService]);

  return { briefing, airports, loading, error };
}
