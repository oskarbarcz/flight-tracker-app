import type { ActivityIndex } from "~/features/stats/lib/activityIndex";
import { utcDate } from "~/features/stats/lib/span";

export type RailMonth = {
  key: string;
  start: Date;
  end: Date;
  blockMinutes: number;
  isJanuary: boolean;
};

export type Rail = {
  from: Date;
  to: Date;
  months: RailMonth[];
  peakBlockMinutes: number;
  years: { year: number; fraction: number }[];
};

export function buildRail(from: Date, to: Date, activity: ActivityIndex): Rail {
  const months: RailMonth[] = [];
  let cursor = utcDate(from.getUTCFullYear(), from.getUTCMonth(), 1);

  while (cursor <= to) {
    const end = utcDate(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 0);
    months.push({
      key: `${cursor.getUTCFullYear()}-${cursor.getUTCMonth()}`,
      start: cursor,
      end,
      blockMinutes: activity.between(cursor, end > to ? to : end).blockMinutes,
      isJanuary: cursor.getUTCMonth() === 0,
    });
    cursor = utcDate(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1);
  }

  const railFrom = months.length > 0 ? months[0].start : from;
  const railTo = months.length > 0 ? months[months.length - 1].end : to;

  const years = months
    .filter((month) => month.isJanuary || month === months[0])
    .map((month) => ({
      year: month.start.getUTCFullYear(),
      fraction: fractionOf(month.start, railFrom, railTo),
    }));

  return {
    from: railFrom,
    to: railTo,
    months,
    peakBlockMinutes: months.reduce((peak, month) => Math.max(peak, month.blockMinutes), 0),
    years,
  };
}

export function fractionOf(moment: Date, from: Date, to: Date): number {
  const total = to.getTime() - from.getTime();
  if (total <= 0) {
    return 0;
  }
  return Math.min(1, Math.max(0, (moment.getTime() - from.getTime()) / total));
}

export function dateAtFraction(fraction: number, from: Date, to: Date): Date {
  const clamped = Math.min(1, Math.max(0, fraction));
  return new Date(from.getTime() + clamped * (to.getTime() - from.getTime()));
}
