import React, { useMemo } from "react";
import { FaChartColumn, FaChevronRight } from "react-icons/fa6";
import { Link } from "react-router";
import { MonthHeatmap } from "~/features/stats/components/Heatmap/MonthHeatmap";
import { useRecentActivity } from "~/features/stats/hooks/useRecentActivity";
import { buildRangeHeatmap } from "~/features/stats/lib/heatmap";
import { formatDuration } from "~/shared/lib/time";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

const WEEKS = 5;
const SKELETON_WEEKS = Array.from({ length: WEEKS }, (_, week) => ({
  key: `week-${week}`,
  days: Array.from({ length: 7 }, (_, day) => `week-${week}-day-${day}`),
}));

function HeatmapSkeleton() {
  return (
    <div className="flex w-fit animate-pulse gap-[2px] motion-reduce:animate-none" aria-hidden={true}>
      {SKELETON_WEEKS.map((week) => (
        <div key={week.key} className="flex flex-col gap-[2px]">
          {week.days.map((day) => (
            <span key={day} className="size-3 rounded-[3px] bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function RecentActivityBox() {
  const { loading, failed, activity, from, to, today } = useRecentActivity(WEEKS);

  const heatmap = useMemo(
    () => buildRangeHeatmap(activity, `Last ${WEEKS} weeks`, from, to, today, { monthLabels: false }),
    [activity, from, to, today],
  );

  return (
    <Container
      padding="condensed"
      header={<CardHeader title="Your activity" />}
      footer={
        <Link
          to="/stats"
          viewTransition={true}
          className="group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
        >
          <span className="flex size-8 flex-none items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-indigo-900 dark:group-hover:text-indigo-300">
            <FaChartColumn size={14} aria-hidden={true} />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-gray-700 dark:text-gray-200">See more stats</span>
            <span className="block text-xs text-gray-500 dark:text-gray-400">Weeks, months and years</span>
          </span>
          <FaChevronRight
            size={13}
            className="ms-auto flex-none text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500 motion-reduce:transition-none dark:text-gray-500"
            aria-hidden={true}
          />
        </Link>
      }
    >
      <div className="flex items-center gap-4">
        {loading ? <HeatmapSkeleton /> : <MonthHeatmap heatmap={heatmap} today={today} />}

        <div className="flex min-w-0 flex-col">
          {loading ? (
            <div className="flex animate-pulse flex-col gap-1.5 motion-reduce:animate-none" aria-hidden={true}>
              <span className="h-3.5 w-28 rounded bg-gray-100 dark:bg-gray-800" />
              <span className="h-2.5 w-20 rounded bg-gray-100 dark:bg-gray-800" />
              <span className="h-2.5 w-24 rounded bg-gray-100 dark:bg-gray-800" />
            </div>
          ) : failed ? (
            <span className="text-xs text-gray-500 dark:text-gray-400">Could not be loaded.</span>
          ) : heatmap.flights === 0 ? (
            <span className="text-xs text-gray-500 dark:text-gray-400">No flights logged.</span>
          ) : (
            <>
              <span className="text-sm font-semibold leading-snug text-gray-900 dark:text-white">
                {heatmap.flights} {heatmap.flights === 1 ? "flight" : "flights"} in the last {WEEKS} weeks
              </span>
              <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[11px]">
                <dt className="text-gray-500 dark:text-gray-400">Block</dt>
                <dd className="text-end font-mono tabular-nums text-gray-700 dark:text-gray-200">
                  {formatDuration(heatmap.blockMinutes)}
                </dd>
                <dt className="text-gray-500 dark:text-gray-400">Air</dt>
                <dd className="text-end font-mono tabular-nums text-gray-700 dark:text-gray-200">
                  {formatDuration(heatmap.airborneMinutes)}
                </dd>
                <dt className="text-gray-500 dark:text-gray-400">Days flown</dt>
                <dd className="text-end font-mono tabular-nums text-gray-700 dark:text-gray-200">
                  {heatmap.daysFlown}
                </dd>
                <dt className="text-gray-500 dark:text-gray-400">Busiest day</dt>
                <dd className="text-end font-mono tabular-nums text-gray-700 dark:text-gray-200">
                  {formatDuration(heatmap.busiestBlockMinutes)}
                </dd>
              </dl>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
