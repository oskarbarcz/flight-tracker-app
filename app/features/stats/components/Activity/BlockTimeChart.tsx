import React from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Bucket } from "~/features/stats/lib/buckets";
import { formatDuration } from "~/shared/lib/time";

type Props = {
  buckets: Bucket[];
  currentLabel: string;
  previousLabel: string;
};

const CURRENT_FILL = "var(--stats-bar-current)";
const PREVIOUS_FILL = "var(--stats-bar-previous)";
const PREVIOUS_STROKE = "var(--stats-bar-previous-edge)";
const BAR_FILL_OPACITY = 0.18;
const PREVIOUS_FILL_OPACITY = 0.08;
const PREVIOUS_STROKE_OPACITY = 0.9;

function ceilToHour(minutes: number): number {
  return Math.max(60, Math.ceil(minutes / 60) * 60);
}

function ChartTooltip({ active, payload, currentLabel, previousLabel }: TooltipProps) {
  const bucket = active ? payload?.[0]?.payload : undefined;
  if (!bucket) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <span className="block font-bold text-gray-900 dark:text-white">{bucket.currentLabel}</span>
      <span className="mt-1 block font-mono tabular-nums text-gray-700 dark:text-gray-200">
        {currentLabel} {formatDuration(bucket.current)}
      </span>
      <span className="block font-mono tabular-nums text-gray-500 dark:text-gray-400">
        {previousLabel} {formatDuration(bucket.previous)} ({bucket.previousLabel})
      </span>
      {bucket.isFuture && <span className="mt-1 block text-gray-500 dark:text-gray-400">No scheduled flights</span>}
    </div>
  );
}

type TooltipProps = {
  active?: boolean;
  payload?: { payload: Bucket }[];
  currentLabel: string;
  previousLabel: string;
};

export function BlockTimeChart({ buckets, currentLabel, previousLabel }: Props) {
  const peak = buckets.reduce((max, bucket) => Math.max(max, bucket.current, bucket.previous), 0);
  const ceiling = ceilToHour(peak);

  return (
    <div className="chart-surface h-full min-h-56 w-full [--stats-bar-current:var(--color-indigo-500,#6875f5)] [--stats-bar-previous:var(--color-gray-400,#9ca3af)] [--stats-bar-previous-edge:var(--color-gray-400,#9ca3af)] dark:[--stats-bar-current:var(--color-indigo-400,#8da2fb)] dark:[--stats-bar-previous:var(--color-gray-500,#6b7280)] dark:[--stats-bar-previous-edge:var(--color-gray-500,#6b7280)]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={buckets} barGap={2} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            interval={0}
            tick={{ fontSize: 11, fill: "currentColor" }}
            className="text-gray-500 dark:text-gray-400"
          />
          <YAxis
            domain={[0, ceiling]}
            ticks={[0, ceiling / 2, ceiling]}
            tickFormatter={formatDuration}
            tickLine={false}
            axisLine={false}
            width={58}
            tick={{ fontSize: 11, fill: "currentColor" }}
            className="text-gray-500 dark:text-gray-400"
          />
          <Tooltip
            cursor={{ fill: "currentColor", className: "text-indigo-50 dark:text-gray-800" }}
            content={<ChartTooltip currentLabel={currentLabel} previousLabel={previousLabel} />}
          />
          <Bar
            dataKey="previous"
            fill={PREVIOUS_FILL}
            fillOpacity={PREVIOUS_FILL_OPACITY}
            stroke={PREVIOUS_STROKE}
            strokeOpacity={PREVIOUS_STROKE_OPACITY}
            strokeWidth={1}
            radius={[3, 3, 0, 0]}
            name={previousLabel}
          />
          <Bar dataKey="current" stroke={CURRENT_FILL} strokeWidth={1} radius={[3, 3, 0, 0]} name={currentLabel}>
            {buckets.map((bucket) => (
              <Cell
                key={bucket.currentLabel}
                fill={CURRENT_FILL}
                fillOpacity={bucket.isFuture ? 0 : BAR_FILL_OPACITY}
                strokeOpacity={bucket.isFuture ? 0 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
