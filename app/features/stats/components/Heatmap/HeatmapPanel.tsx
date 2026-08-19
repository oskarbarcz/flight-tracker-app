import React, { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { BlurReveal } from "~/features/stats/components/BlurReveal";
import { ActivityHeatmap } from "~/features/stats/components/Heatmap/ActivityHeatmap";
import { YearSwitcher } from "~/features/stats/components/Heatmap/YearSwitcher";
import type { Stats } from "~/features/stats/hooks/useStats";
import { buildYearHeatmap, loggedYears } from "~/features/stats/lib/heatmap";
import { formatDuration } from "~/shared/lib/time";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { CardDescription } from "~/shared/ui/Layout/CardDescription";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Props = {
  stats: Stats;
};

type MonthRow = {
  key: string;
  label: string;
  flights: number;
  blockMinutes: number;
  airborneMinutes: number;
  daysFlown: number;
};

export function HeatmapPanel({ stats }: Props) {
  const [expanded, setExpanded] = useState(false);

  const years = useMemo(() => loggedYears(stats.firstFlightAt, stats.today), [stats.firstFlightAt, stats.today]);
  const [year, setYear] = useState(stats.today.getUTCFullYear());

  const heatmap = useMemo(
    () => buildYearHeatmap(stats.activity, year, stats.today),
    [stats.activity, year, stats.today],
  );

  const months: MonthRow[] = useMemo(() => {
    const rows = new Map<string, MonthRow>();

    for (let month = 0; month < 12; month += 1) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}`;
      rows.set(key, {
        key,
        label: `${MONTHS[month]} ${year}`,
        flights: 0,
        blockMinutes: 0,
        airborneMinutes: 0,
        daysFlown: 0,
      });
    }

    for (const column of heatmap.columns) {
      for (const day of column.days) {
        if (!day.inRange || day.isFuture) {
          continue;
        }

        const row = rows.get(day.key.slice(0, 7));
        if (row === undefined) {
          continue;
        }

        row.flights += day.totals.flights;
        row.blockMinutes += day.totals.blockMinutes;
        row.airborneMinutes += day.totals.airborneMinutes;
        row.daysFlown += day.totals.flights > 0 ? 1 : 0;
      }
    }

    return [...rows.values()].sort((a, b) => a.key.localeCompare(b.key));
  }, [heatmap, year]);

  return (
    <Container
      padding="normal"
      header={
        <CardHeader
          title="Flying activity"
          actions={<YearSwitcher years={years} selected={year} onSelect={setYear} />}
        />
      }
    >
      <CardDescription>Day by day breakdown</CardDescription>

      <ActivityHeatmap heatmap={heatmap} today={stats.today} />

      {months.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
          <div className="flex h-8 items-center gap-2.5">
            <FieldLabel>Monthly breakdown</FieldLabel>
          </div>

          <BlurReveal
            expanded={expanded}
            onExpand={() => setExpanded(true)}
            label="Show monthly breakdown"
            overlayLabel="Show monthly breakdown"
            previewHeight={44}
            contentClassName="overflow-x-auto"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-2 pe-3 text-start text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Month
                  </th>
                  <th className="pb-2 pe-3 text-end text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Flights
                  </th>
                  <th className="pb-2 pe-3 text-end text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Block
                  </th>
                  <th className="pb-2 pe-3 text-end text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Air
                  </th>
                  <th className="pb-2 text-end text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Days flown
                  </th>
                </tr>
              </thead>
              <tbody>
                {months.map((month) => (
                  <tr
                    key={month.key}
                    className={twMerge(
                      "border-b border-gray-100 last:border-b-0 dark:border-gray-800",
                      month.flights === 0 ? "text-gray-400 dark:text-gray-600" : "text-gray-700 dark:text-gray-200",
                    )}
                  >
                    <td
                      className={twMerge(
                        "py-2 pe-3 whitespace-nowrap uppercase",
                        month.flights > 0 && "text-gray-900 dark:text-white",
                      )}
                    >
                      {month.label}
                    </td>
                    <td className="py-2 pe-3 text-end font-mono tabular-nums">{month.flights}</td>
                    <td className="py-2 pe-3 text-end font-mono tabular-nums">{formatDuration(month.blockMinutes)}</td>
                    <td className="py-2 pe-3 text-end font-mono tabular-nums">
                      {formatDuration(month.airborneMinutes)}
                    </td>
                    <td className="py-2 text-end font-mono tabular-nums">{month.daysFlown}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </BlurReveal>

          {expanded && (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="w-full cursor-pointer rounded-lg py-1 text-center text-[11px] font-bold uppercase tracking-wider text-indigo-700 transition-colors hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-indigo-300 dark:hover:bg-indigo-950"
            >
              Hide
            </button>
          )}
        </div>
      )}
    </Container>
  );
}
