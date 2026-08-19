import React from "react";

type Props = {
  elapsedDays: number | null;
  totalDays: number;
};

export function SpanExtent({ elapsedDays, totalDays }: Props) {
  if (elapsedDays === null) {
    return <span className="font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">{totalDays} days</span>;
  }

  const percent = Math.min(100, (elapsedDays / totalDays) * 100);

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="whitespace-nowrap font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
        {elapsedDays} of {totalDays} days
      </span>
      <span className="h-1 w-24 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <span
          className="block h-full rounded-full bg-indigo-500 transition-[width] duration-500 ease-out motion-reduce:transition-none dark:bg-indigo-400"
          style={{ width: `${percent}%` }}
        />
      </span>
      <span className="font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">{percent.toFixed(0)}%</span>
    </div>
  );
}
