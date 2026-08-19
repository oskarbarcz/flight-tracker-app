import { useEffect, useMemo, useState } from "react";
import type { Airframe } from "~/features/airframe";
import type { Airport } from "~/features/airport/model";
import { type ActivityIndex, createActivityIndex } from "~/features/stats/lib/activityIndex";
import { startOfUtcDay, toIsoDate } from "~/features/stats/lib/span";
import type { ActivityDay, AircraftTypeStat, PeriodStats, StatsSummary } from "~/features/stats/model";
import { useApi } from "~/shared/api/useApi";

type StatsState = {
  loading: boolean;
  failed: boolean;
  summary: StatsSummary | null;
  periods: PeriodStats | null;
  activity: ActivityDay[];
  aircraftTypes: AircraftTypeStat[];
  airframes: Airframe[];
  airports: Airport[];
};

export type Stats = {
  loading: boolean;
  failed: boolean;
  hasFlown: boolean;
  summary: StatsSummary | null;
  periods: PeriodStats | null;
  activity: ActivityIndex;
  aircraftTypes: AircraftTypeStat[];
  airframesByType: Record<string, Airframe>;
  airportsByIcao: Record<string, Airport>;
  firstFlightAt: Date | null;
  today: Date;
};

export function useStats(): Stats {
  const { statsService, airframeService, airportService } = useApi();
  const [state, setState] = useState<StatsState>({
    loading: true,
    failed: false,
    summary: null,
    periods: null,
    activity: [],
    aircraftTypes: [],
    airframes: [],
    airports: [],
  });

  const today = useMemo(() => startOfUtcDay(new Date()), []);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [summary, periods, aircraftTypes, airframes, airports] = await Promise.all([
          statsService.fetchSummary(),
          statsService.fetchPeriods(),
          statsService.fetchAircraftTypes(),
          airframeService.fetchAll().catch(() => []),
          airportService.fetchAll().catch(() => []),
        ]);

        const firstFlightAt = summary.records.firstFlightAt;
        const activity = firstFlightAt
          ? await statsService.fetchActivity(toIsoDate(startOfUtcDay(new Date(firstFlightAt))), toIsoDate(today))
          : [];

        if (active) {
          setState({ loading: false, failed: false, summary, periods, activity, aircraftTypes, airframes, airports });
        }
      } catch {
        if (active) {
          setState({
            loading: false,
            failed: true,
            summary: null,
            periods: null,
            activity: [],
            aircraftTypes: [],
            airframes: [],
            airports: [],
          });
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [statsService, airframeService, airportService, today]);

  const activity = useMemo(() => createActivityIndex(state.activity), [state.activity]);
  const airframesByType = useMemo(
    () => Object.fromEntries(state.airframes.map((airframe) => [airframe.type, airframe])),
    [state.airframes],
  );
  const airportsByIcao = useMemo(
    () => Object.fromEntries(state.airports.map((airport) => [airport.icaoCode, airport])),
    [state.airports],
  );
  const firstFlightAt = state.summary?.records.firstFlightAt ?? null;

  return {
    loading: state.loading,
    failed: state.failed,
    hasFlown: Boolean(firstFlightAt),
    summary: state.summary,
    periods: state.periods,
    activity,
    aircraftTypes: state.aircraftTypes,
    airframesByType,
    airportsByIcao,
    firstFlightAt: firstFlightAt ? startOfUtcDay(new Date(firstFlightAt)) : null,
    today,
  };
}
