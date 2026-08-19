import { addUtcDays, dayDifference, toIsoDate } from "~/features/stats/lib/span";
import type { ActivityDay } from "~/features/stats/model";

export type ActivityTotals = {
  flights: number;
  airborneMinutes: number;
  blockMinutes: number;
};

const EMPTY: ActivityTotals = { flights: 0, airborneMinutes: 0, blockMinutes: 0 };

export type ActivityIndex = {
  onDay: (date: Date) => ActivityTotals;
  between: (from: Date, to: Date) => ActivityTotals;
};

export function createActivityIndex(days: ActivityDay[]): ActivityIndex {
  const byDay = new Map<string, ActivityTotals>();

  for (const day of days) {
    byDay.set(day.day, {
      flights: day.flights,
      airborneMinutes: day.airborneMinutes,
      blockMinutes: day.blockMinutes,
    });
  }

  function onDay(date: Date): ActivityTotals {
    return byDay.get(toIsoDate(date)) ?? EMPTY;
  }

  function between(from: Date, to: Date): ActivityTotals {
    const total = { ...EMPTY };

    for (let offset = 0; offset <= dayDifference(from, to); offset += 1) {
      const day = onDay(addUtcDays(from, offset));
      total.flights += day.flights;
      total.airborneMinutes += day.airborneMinutes;
      total.blockMinutes += day.blockMinutes;
    }

    return total;
  }

  return { onDay, between };
}
