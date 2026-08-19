export type SpanKind = "week" | "month" | "year" | "custom";

export type Span = {
  kind: SpanKind;
  from: Date;
  to: Date;
  prevFrom: Date;
  prevTo: Date;
  label: string;
  prevLabel: string;
  inProgress: boolean;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_MS = 86_400_000;

export function utcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day));
}

export function startOfUtcDay(date: Date): Date {
  return utcDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function addUtcDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

export function dayDifference(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / DAY_MS);
}

export function daysInSpan(span: Span): number {
  return dayDifference(span.from, span.to) + 1;
}

export function daysInMonth(year: number, month: number): number {
  return utcDate(year, month + 1, 0).getUTCDate();
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function fromIsoDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export function startOfUtcWeek(date: Date): Date {
  const day = startOfUtcDay(date);
  return addUtcDays(day, -((day.getUTCDay() + 6) % 7));
}

function dayAndMonth(date: Date): string {
  return `${String(date.getUTCDate()).padStart(2, "0")} ${MONTHS[date.getUTCMonth()]}`;
}

function weekLabel(from: Date, to: Date): string {
  const year = to.getUTCFullYear();

  if (from.getUTCMonth() === to.getUTCMonth()) {
    const days = `${String(from.getUTCDate()).padStart(2, "0")}–${String(to.getUTCDate()).padStart(2, "0")}`;
    return `${days} ${MONTHS[to.getUTCMonth()]} ${year}`;
  }

  const left = from.getUTCFullYear() === year ? dayAndMonth(from) : `${dayAndMonth(from)} ${from.getUTCFullYear()}`;
  return `${left} – ${dayAndMonth(to)} ${year}`;
}

function monthLabel(date: Date): string {
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function build(kind: SpanKind, from: Date, to: Date, prevFrom: Date, prevTo: Date, today: Date): Span {
  const label =
    kind === "week" ? weekLabel(from, to) : kind === "month" ? monthLabel(from) : String(from.getUTCFullYear());
  const prevLabel =
    kind === "week"
      ? weekLabel(prevFrom, prevTo)
      : kind === "month"
        ? monthLabel(prevFrom)
        : String(prevFrom.getUTCFullYear());

  return { kind, from, to, prevFrom, prevTo, label, prevLabel, inProgress: from <= today && today <= to };
}

export function presetSpan(kind: "week" | "month" | "year", offset: number, today: Date): Span {
  const day = startOfUtcDay(today);

  if (kind === "week") {
    const from = addUtcDays(startOfUtcWeek(day), offset * 7);
    return build(kind, from, addUtcDays(from, 6), addUtcDays(from, -7), addUtcDays(from, -1), day);
  }

  if (kind === "month") {
    const from = utcDate(day.getUTCFullYear(), day.getUTCMonth() + offset, 1);
    const to = utcDate(from.getUTCFullYear(), from.getUTCMonth() + 1, 0);
    const prevFrom = utcDate(from.getUTCFullYear() - 1, from.getUTCMonth(), 1);
    const prevTo = utcDate(prevFrom.getUTCFullYear(), prevFrom.getUTCMonth() + 1, 0);
    return build(kind, from, to, prevFrom, prevTo, day);
  }

  const year = day.getUTCFullYear() + offset;
  return build(
    kind,
    utcDate(year, 0, 1),
    utcDate(year, 11, 31),
    utcDate(year - 1, 0, 1),
    utcDate(year - 1, 11, 31),
    day,
  );
}

export function customSpan(from: Date, to: Date, today: Date): Span {
  const day = startOfUtcDay(today);
  const length = dayDifference(from, to) + 1;
  const prevTo = addUtcDays(from, -1);
  const prevFrom = addUtcDays(prevTo, -(length - 1));

  return {
    kind: "custom",
    from,
    to,
    prevFrom,
    prevTo,
    label: `${dayAndMonth(from)} – ${dayAndMonth(to)} ${to.getUTCFullYear()}`,
    prevLabel: `the previous ${length} days`,
    inProgress: from <= day && day <= to,
  };
}

export function earliestOffset(kind: "week" | "month" | "year", firstFlightAt: Date, today: Date): number {
  const first = startOfUtcDay(firstFlightAt);

  for (let offset = 0; offset > -1200; offset -= 1) {
    if (presetSpan(kind, offset, today).to < first) {
      return offset + 1;
    }
  }

  return 0;
}

export function offsetContaining(kind: "week" | "month" | "year", date: Date, today: Date): number {
  const day = startOfUtcDay(today);

  if (kind === "week") {
    return Math.round(dayDifference(startOfUtcWeek(day), startOfUtcWeek(date)) / 7);
  }
  if (kind === "month") {
    return (date.getUTCFullYear() - day.getUTCFullYear()) * 12 + (date.getUTCMonth() - day.getUTCMonth());
  }
  return date.getUTCFullYear() - day.getUTCFullYear();
}

export function secondaryBaseline(span: Span): { from: Date; to: Date; label: string } | null {
  if (span.kind === "year") {
    return null;
  }

  if (span.kind === "week") {
    const from = addUtcDays(span.from, -364);
    const to = addUtcDays(from, 6);
    return { from, to, label: weekLabel(from, to) };
  }

  if (span.kind === "month") {
    const from = utcDate(span.from.getUTCFullYear(), span.from.getUTCMonth() - 1, 1);
    const to = utcDate(from.getUTCFullYear(), from.getUTCMonth() + 1, 0);
    return { from, to, label: monthLabel(from) };
  }

  const from = utcDate(span.from.getUTCFullYear() - 1, span.from.getUTCMonth(), span.from.getUTCDate());
  const to = utcDate(span.to.getUTCFullYear() - 1, span.to.getUTCMonth(), span.to.getUTCDate());
  return { from, to, label: `${dayAndMonth(from)} \u2013 ${dayAndMonth(to)} ${to.getUTCFullYear()}` };
}
