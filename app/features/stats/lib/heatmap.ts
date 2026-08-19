import type { ActivityIndex, ActivityTotals } from "~/features/stats/lib/activityIndex";
import { addUtcDays, startOfUtcWeek, toIsoDate, utcDate } from "~/features/stats/lib/span";
import { formatDuration } from "~/shared/lib/time";

export type HeatmapDay = {
  key: string;
  date: Date;
  totals: ActivityTotals;
  level: number;
  inRange: boolean;
  isFuture: boolean;
};

export type HeatmapColumn = {
  key: string;
  days: HeatmapDay[];
  monthLabel: string | null;
};

export type Heatmap = {
  label: string;
  columns: HeatmapColumn[];
  flights: number;
  blockMinutes: number;
  airborneMinutes: number;
  busiestBlockMinutes: number;
  daysFlown: number;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const EMPTY: ActivityTotals = { flights: 0, airborneMinutes: 0, blockMinutes: 0 };

export function heatLevel(blockMinutes: number): number {
  if (blockMinutes <= 0) {
    return 0;
  }
  if (blockMinutes < 90) {
    return 1;
  }
  if (blockMinutes < 200) {
    return 2;
  }
  if (blockMinutes < 360) {
    return 3;
  }
  return blockMinutes < 560 ? 4 : 5;
}

export function loggedYears(firstFlightAt: Date | null, today: Date): number[] {
  const latest = today.getUTCFullYear();
  const earliest = firstFlightAt === null ? latest : firstFlightAt.getUTCFullYear();
  const years: number[] = [];

  for (let year = earliest; year <= latest; year += 1) {
    years.push(year);
  }

  return years;
}

export function formatDayDate(date: Date): string {
  return `${String(date.getUTCDate()).padStart(2, "0")} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function describeDay(day: HeatmapDay): string {
  const when = formatDayDate(day.date);

  if (day.totals.flights === 0) {
    return `${when} · no flights`;
  }

  const flights = `${day.totals.flights} ${day.totals.flights === 1 ? "flight" : "flights"}`;
  return `${when} · ${flights} · ${formatDuration(day.totals.blockMinutes)} block`;
}

export function buildRangeHeatmap(
  activity: ActivityIndex,
  label: string,
  from: Date,
  to: Date,
  today: Date,
  options: { monthLabels: boolean } = { monthLabels: true },
): Heatmap {
  const start = startOfUtcWeek(from);
  const weeks = Math.round((startOfUtcWeek(to).getTime() - start.getTime()) / (7 * 86_400_000)) + 1;

  const columns: HeatmapColumn[] = [];
  let flights = 0;
  let blockMinutes = 0;
  let airborneMinutes = 0;
  let busiestBlockMinutes = 0;
  let daysFlown = 0;
  let lastMonth = -1;

  for (let week = 0; week < weeks; week += 1) {
    const columnStart = addUtcDays(start, week * 7);
    const days: HeatmapDay[] = [];

    for (let weekday = 0; weekday < 7; weekday += 1) {
      const date = addUtcDays(columnStart, weekday);
      const inRange = date >= from && date <= to;
      const isFuture = date > today;
      const totals = inRange && !isFuture ? activity.onDay(date) : EMPTY;

      if (inRange && !isFuture && totals.flights > 0) {
        flights += totals.flights;
        blockMinutes += totals.blockMinutes;
        airborneMinutes += totals.airborneMinutes;
        busiestBlockMinutes = Math.max(busiestBlockMinutes, totals.blockMinutes);
        daysFlown += 1;
      }

      days.push({ key: toIsoDate(date), date, totals, level: heatLevel(totals.blockMinutes), inRange, isFuture });
    }

    const labelDay = days.find((day) => day.inRange);
    const month = labelDay?.date.getUTCMonth() ?? -1;
    const showMonth = options.monthLabels && month !== -1 && month !== lastMonth && week < weeks - 2;
    if (showMonth) {
      lastMonth = month;
    }

    columns.push({ key: toIsoDate(columnStart), days, monthLabel: showMonth ? MONTHS[month] : null });
  }

  return { label, columns, flights, blockMinutes, airborneMinutes, busiestBlockMinutes, daysFlown };
}

export function buildYearHeatmap(activity: ActivityIndex, year: number, today: Date): Heatmap {
  return buildRangeHeatmap(activity, String(year), utcDate(year, 0, 1), utcDate(year, 11, 31), today);
}
