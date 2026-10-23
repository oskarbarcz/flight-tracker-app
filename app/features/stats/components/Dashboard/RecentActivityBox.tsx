import React, { useMemo, useRef, useState } from "react";
import { FaChartColumn } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import { useRecentActivity } from "~/features/stats/hooks/useRecentActivity";
import type { ActivityTotals } from "~/features/stats/lib/activityIndex";
import { addUtcDays, toIsoDate } from "~/features/stats/lib/span";
import { useUserStats } from "~/features/user/hooks/useUserStats";
import { formatDuration, padZero } from "~/shared/lib/time";
import { dateToIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { CardFooterLink } from "~/shared/ui/Layout/CardFooterLink";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

const DAYS = 7;
const SMALLEST_SCALE_MINUTES = 60;
const SMALLEST_VISIBLE_SHARE = 8;

type DayActivity = {
  date: Date;
  totals: ActivityTotals;
};

const BAR_KEYS: Record<string, (index: number) => number> = {
  ArrowLeft: (index) => index - 1,
  ArrowRight: (index) => index + 1,
  Home: () => 0,
  End: () => DAYS - 1,
};

function flightsLabel(count: number): string {
  return count === 1 ? "1 flight" : `${count} flights`;
}

function describeDay({ date, totals }: DayActivity): string {
  const day = dateToIcaoDate(date);

  if (totals.flights === 0) {
    return `${day}: no flights`;
  }

  return `${day}: ${formatDuration(totals.blockMinutes)} block, ${flightsLabel(totals.flights)}`;
}

function DurationFigure({ minutes, size }: { minutes: number; size: "lg" | "sm" }) {
  const unit = twMerge(
    "font-normal text-gray-500 dark:text-gray-400",
    size === "lg" ? "mx-1 text-sm" : "mx-0.5 text-2xs",
  );

  return (
    <span
      className={twMerge(
        "font-mono font-bold tabular-nums text-gray-900 dark:text-white",
        size === "lg" ? "text-3xl leading-none" : "text-sm",
      )}
    >
      {Math.floor(minutes / 60).toLocaleString("en-US")}
      <span className={unit}>h</span>
      {padZero(minutes % 60)}
      <span className={twMerge(unit, "me-0")}>m</span>
    </span>
  );
}

function Quantity({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <span className="whitespace-nowrap">
      <span className="font-mono text-sm font-bold tabular-nums text-gray-900 dark:text-white">{value}</span>
      <span className="ms-0.5 font-mono text-2xs text-gray-500 dark:text-gray-400">{unit}</span>
      <span className="ms-1 text-xs text-gray-500 dark:text-gray-400">{label}</span>
    </span>
  );
}

function LoadFailed({ subject }: { subject: string }) {
  return (
    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
      {subject} could not be loaded. Reload the page to try again.
    </p>
  );
}

function LifetimeTotals() {
  const { stats, loading, failed } = useUserStats();

  return (
    <div className="px-3 pb-3 pt-2.5">
      <FieldLabel>Total block time</FieldLabel>
      {loading ? (
        <div className="animate-pulse motion-reduce:animate-none" aria-hidden={true}>
          <span className="mt-1.5 block h-7 w-32 rounded bg-gray-100 dark:bg-gray-800" />
          <span className="mt-2.5 block h-3.5 w-48 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
      ) : failed || stats === null ? (
        <LoadFailed subject="Your totals" />
      ) : (
        <>
          <div className="mt-1.5">
            <DurationFigure minutes={stats.total.blockTime} size="lg" />
          </div>
          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
            <Quantity
              value={(stats.total.totalFuelBurned / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 })}
              unit="t"
              label="fuel burned"
            />
            <Quantity value={stats.total.totalGreatCircleDistance.toLocaleString("en-US")} unit="nm" label="flown" />
          </div>
        </>
      )}
    </div>
  );
}

function Readout({ days, selected }: { days: DayActivity[]; selected: DayActivity | null }) {
  if (selected !== null) {
    return (
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {dateToIcaoDate(selected.date)} ·{" "}
        {selected.totals.flights === 0 ? (
          "no flights"
        ) : (
          <>
            <DurationFigure minutes={selected.totals.blockMinutes} size="sm" /> ·{" "}
            {flightsLabel(selected.totals.flights)}
          </>
        )}
      </span>
    );
  }

  const flights = days.reduce((sum, day) => sum + day.totals.flights, 0);
  const blockMinutes = days.reduce((sum, day) => sum + day.totals.blockMinutes, 0);

  if (flights === 0) {
    return <span className="text-xs text-gray-500 dark:text-gray-400">No flights</span>;
  }

  return (
    <span className="text-xs text-gray-500 dark:text-gray-400">
      <DurationFigure minutes={blockMinutes} size="sm" /> · {flightsLabel(flights)}
    </span>
  );
}

function RecentDays() {
  const { loading, failed, activity, from, today } = useRecentActivity(DAYS);
  const [selected, setSelected] = useState<number | null>(null);
  const [focusable, setFocusable] = useState(DAYS - 1);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);

  const days = useMemo(
    () =>
      Array.from({ length: DAYS }, (_, offset) => {
        const date = addUtcDays(from, offset);
        return { date, totals: activity.onDay(date) };
      }),
    [activity, from],
  );

  const todayKey = toIsoDate(today);
  const scale = Math.max(SMALLEST_SCALE_MINUTES, ...days.map((day) => day.totals.blockMinutes));

  function moveFocus(event: React.KeyboardEvent, index: number) {
    const next = BAR_KEYS[event.key]?.(index);

    if (next === undefined || next < 0 || next >= DAYS) {
      return;
    }

    event.preventDefault();
    setFocusable(next);
    bars.current[next]?.focus();
  }

  return (
    <div className="border-t border-gray-200 bg-gray-50 px-3 pb-3 pt-2.5 dark:border-gray-800 dark:bg-gray-800/50">
      <div className="flex items-baseline justify-between gap-3">
        <FieldLabel>Last {DAYS} days</FieldLabel>
        {!loading && !failed && <Readout days={days} selected={selected === null ? null : days[selected]} />}
      </div>

      {failed ? (
        <LoadFailed subject="Your recent activity" />
      ) : (
        <>
          <div
            role="group"
            aria-label={`Block time per day, last ${DAYS} days`}
            className={twMerge(
              "mt-2.5 grid grid-cols-7 gap-1.5",
              loading && "animate-pulse motion-reduce:animate-none",
            )}
            onMouseLeave={() => setSelected(null)}
          >
            {days.map((day, index) => {
              const isToday = toIsoDate(day.date) === todayKey;
              const share =
                day.totals.blockMinutes === 0
                  ? 0
                  : Math.max(SMALLEST_VISIBLE_SHARE, Math.round((day.totals.blockMinutes / scale) * 100));

              return (
                <span
                  key={toIsoDate(day.date)}
                  ref={(node) => {
                    bars.current[index] = node;
                  }}
                  role="img"
                  aria-label={describeDay(day)}
                  tabIndex={loading ? undefined : index === focusable ? 0 : -1}
                  onMouseEnter={() => setSelected(index)}
                  onFocus={() => {
                    setSelected(index);
                    setFocusable(index);
                  }}
                  onBlur={() => setSelected(null)}
                  onKeyDown={(event) => moveFocus(event, index)}
                  className={twMerge(
                    "flex h-16 flex-col justify-end rounded-lg border bg-white p-0.5 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-gray-900 dark:focus-visible:ring-indigo-400",
                    isToday ? "border-gray-900 dark:border-white" : "border-gray-200 dark:border-gray-700",
                    selected === index && "border-indigo-500 dark:border-indigo-400",
                  )}
                >
                  {!loading && share > 0 && <span className="rounded bg-indigo-500" style={{ height: `${share}%` }} />}
                </span>
              );
            })}
          </div>
          <div className="mt-1.5 grid grid-cols-7 gap-1.5" aria-hidden={true}>
            {days.map((day) => {
              const isToday = toIsoDate(day.date) === todayKey;

              return (
                <span
                  key={toIsoDate(day.date)}
                  className={twMerge(
                    "text-center font-mono text-2xs",
                    isToday ? "font-bold text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400",
                  )}
                >
                  {padZero(day.date.getUTCDate())}
                </span>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function RecentActivityBox() {
  return (
    <Container
      padding="none"
      header={<CardHeader title="Your activity" />}
      footer={
        <CardFooterLink to="/stats" icon={FaChartColumn} title="See more stats" description="Weeks, months and years" />
      }
    >
      <div>
        <LifetimeTotals />
        <RecentDays />
      </div>
    </Container>
  );
}
