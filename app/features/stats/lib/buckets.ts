import type { ActivityIndex } from "~/features/stats/lib/activityIndex";
import {
  addUtcDays,
  dayDifference,
  daysInMonth,
  daysInSpan,
  type Span,
  startOfUtcWeek,
  utcDate,
} from "~/features/stats/lib/span";

export type Granularity = "day" | "week" | "month";

export type Bucket = {
  label: string;
  current: number;
  previous: number;
  currentLabel: string;
  previousLabel: string;
  isFuture: boolean;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function granularityFor(span: Span): Granularity {
  if (span.kind === "week" || span.kind === "month") {
    return "day";
  }
  if (span.kind === "year") {
    return "month";
  }

  const length = daysInSpan(span);
  if (length <= 31) {
    return "day";
  }
  return length <= 126 ? "week" : "month";
}

function dayAndMonth(date: Date): string {
  return `${String(date.getUTCDate()).padStart(2, "0")} ${MONTHS[date.getUTCMonth()]}`;
}

function dayLabel(span: Span, date: Date, index: number, count: number): string {
  if (span.kind === "week") {
    return WEEKDAYS[index];
  }

  const dayOfMonth = date.getUTCDate();
  if (span.kind === "month") {
    return dayOfMonth === 1 || dayOfMonth % 5 === 0 ? String(dayOfMonth) : "";
  }

  const every = Math.max(1, Math.ceil(count / 8));
  return index % every === 0 ? dayAndMonth(date) : "";
}

function dayBuckets(span: Span, activity: ActivityIndex, today: Date): Bucket[] {
  const count =
    span.kind === "month" ? daysInMonth(span.from.getUTCFullYear(), span.from.getUTCMonth()) : daysInSpan(span);
  const buckets: Bucket[] = [];

  for (let index = 0; index < count; index += 1) {
    const date = addUtcDays(span.from, index);
    const previousDate = addUtcDays(span.prevFrom, index);
    const previousInSpan = previousDate <= span.prevTo;

    buckets.push({
      label: dayLabel(span, date, index, count),
      current: activity.onDay(date).blockMinutes,
      previous: previousInSpan ? activity.onDay(previousDate).blockMinutes : 0,
      currentLabel: `${dayAndMonth(date)} ${date.getUTCFullYear()}`,
      previousLabel: previousInSpan
        ? `${dayAndMonth(previousDate)} ${previousDate.getUTCFullYear()}`
        : "no matching day",
      isFuture: date > today,
    });
  }

  return buckets;
}

function weekBuckets(span: Span, activity: ActivityIndex, today: Date): Bucket[] {
  const shift = dayDifference(span.prevFrom, span.from);
  const buckets: Bucket[] = [];
  let cursor = startOfUtcWeek(span.from);
  let index = 0;

  while (cursor <= span.to) {
    const weekEnd = addUtcDays(cursor, 6);
    const from = cursor < span.from ? span.from : cursor;
    const to = weekEnd > span.to ? span.to : weekEnd;
    const previousFrom = addUtcDays(from, -shift);
    const previousTo = addUtcDays(to, -shift);
    const inBaseline = previousFrom <= span.prevTo;

    buckets.push({
      label: index % 2 === 0 ? dayAndMonth(from) : "",
      current: activity.between(from, to > today ? today : to).blockMinutes,
      previous: inBaseline ? activity.between(previousFrom, previousTo).blockMinutes : 0,
      currentLabel: `Week of ${dayAndMonth(from)} ${from.getUTCFullYear()}`,
      previousLabel: inBaseline
        ? `week of ${dayAndMonth(previousFrom)} ${previousFrom.getUTCFullYear()}`
        : "no matching week",
      isFuture: from > today,
    });

    cursor = addUtcDays(cursor, 7);
    index += 1;
  }

  return buckets;
}

function monthBuckets(span: Span, activity: ActivityIndex, today: Date): Bucket[] {
  const buckets: Bucket[] = [];
  let cursor = utcDate(span.from.getUTCFullYear(), span.from.getUTCMonth(), 1);
  let index = 0;

  while (cursor <= span.to) {
    const monthEnd = utcDate(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 0);
    const from = cursor < span.from ? span.from : cursor;
    const to = monthEnd > span.to ? span.to : monthEnd;

    const previousStart = utcDate(span.prevFrom.getUTCFullYear(), span.prevFrom.getUTCMonth() + index, 1);
    const previousEnd = utcDate(previousStart.getUTCFullYear(), previousStart.getUTCMonth() + 1, 0);
    const previousFrom = previousStart < span.prevFrom ? span.prevFrom : previousStart;
    const previousTo = previousEnd > span.prevTo ? span.prevTo : previousEnd;
    const inBaseline = previousFrom <= span.prevTo;

    buckets.push({
      label: MONTHS[cursor.getUTCMonth()],
      current: activity.between(from, to > today ? today : to).blockMinutes,
      previous: inBaseline ? activity.between(previousFrom, previousTo).blockMinutes : 0,
      currentLabel: `${MONTHS[cursor.getUTCMonth()]} ${cursor.getUTCFullYear()}`,
      previousLabel: inBaseline
        ? `${MONTHS[previousFrom.getUTCMonth()]} ${previousFrom.getUTCFullYear()}`
        : "no matching month",
      isFuture: from > today,
    });

    cursor = utcDate(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1);
    index += 1;
  }

  return buckets;
}

export function bucketsFor(span: Span, activity: ActivityIndex, today: Date): Bucket[] {
  const granularity = granularityFor(span);

  if (granularity === "day") {
    return dayBuckets(span, activity, today);
  }

  if (granularity === "week") {
    return weekBuckets(span, activity, today);
  }

  return monthBuckets(span, activity, today);
}
