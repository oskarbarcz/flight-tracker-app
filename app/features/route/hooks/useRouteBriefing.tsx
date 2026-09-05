import React, { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import type { Airport } from "~/features/airport/model";
import type { Flight } from "~/features/flight";
import {
  buildFixInsights,
  type FixInsight,
  type FuelMarginSummary,
  type RouteSummary,
  summariseFuelMargin,
  summariseRoute,
} from "~/features/route/lib/routeInsights";
import type { EtopsBriefing } from "~/features/route/model";
import { type AssignedRunways, useAssignedRunways } from "~/features/runway/hooks/useAssignedRunways";
import { isNotFound } from "~/shared/api/api.service";
import { useApi } from "~/shared/api/useApi";

type Return = {
  briefing: EtopsBriefing | null;
  airports: Map<string, Airport>;
  loading: boolean;
  error: Error | null;
};

export type RouteBriefingState = Return & {
  runways: AssignedRunways;
  insights: FixInsight[];
  summary: RouteSummary | null;
  margin: FuelMarginSummary | null;
  selectedOrdinal: number | null;
  select: (ordinal: number) => void;
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

function useRouteBriefing(flightId: string | null): Return {
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

const RouteBriefing = createContext<RouteBriefingState | null>(null);

const NO_ANALYSIS = { insights: [] as FixInsight[], summary: null, margin: null };

function analyse(briefing: EtopsBriefing | null) {
  if (briefing === null) {
    return NO_ANALYSIS;
  }

  const insights = buildFixInsights(briefing.route.fixes);

  return { insights, summary: summariseRoute(briefing.route), margin: summariseFuelMargin(insights) };
}

function emphasisedOrdinal(insights: FixInsight[], margin: FuelMarginSummary | null): number | null {
  if (margin !== null && !margin.isConstant) {
    return margin.tightest.fix.ordinal;
  }

  return insights[0]?.fix.ordinal ?? null;
}

export function RouteBriefingProvider({ flight, children }: { flight: Flight | null; children: ReactNode }) {
  const fetched = useRouteBriefing(flight?.id ?? null);
  const runways = useAssignedRunways(flight);
  const [chosenOrdinal, setChosenOrdinal] = useState<number | null>(null);
  const analysis = useMemo(() => analyse(fetched.briefing), [fetched.briefing]);

  const state: RouteBriefingState = {
    ...fetched,
    ...analysis,
    runways,
    selectedOrdinal: chosenOrdinal ?? emphasisedOrdinal(analysis.insights, analysis.margin),
    select: setChosenOrdinal,
  };

  return <RouteBriefing.Provider value={state}>{children}</RouteBriefing.Provider>;
}

export function useRouteBriefingState(): RouteBriefingState {
  const state = useContext(RouteBriefing);

  if (state === null) {
    throw new Error("useRouteBriefingState must be used within a RouteBriefingProvider");
  }

  return state;
}

export function usePlannedRoute(): RouteBriefingState | null {
  return useContext(RouteBriefing);
}
