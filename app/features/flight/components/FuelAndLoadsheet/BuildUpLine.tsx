import React from "react";
import { twMerge } from "tailwind-merge";

export function formatTons(value: number): string {
  return value.toFixed(2);
}

function Figure({ value, unit = "t", className }: { value: number; unit?: string; className?: string }) {
  return (
    <span className={twMerge("font-mono tabular-nums text-sm text-gray-700 dark:text-gray-300", className)}>
      {formatTons(value)}
      <span className="ms-0.5 text-[10px] font-normal opacity-60">{unit}</span>
    </span>
  );
}

type Props = {
  label: string;
  value: number;
  note?: string;
  unit?: string;
  duration?: string;
  subtotal?: boolean;
  total?: boolean;
  addition?: boolean;
};

export function BuildUpLine({ label, value, note, unit = "t", duration, subtotal, total, addition }: Props) {
  return (
    <div
      className={twMerge(
        "flex items-baseline justify-between gap-2 py-0.5",
        (subtotal || total) && "mt-0.5 pt-1.5",
        subtotal && "border-t border-gray-200 dark:border-gray-800",
        total && "border-t-2 border-gray-300 dark:border-gray-700",
      )}
    >
      <span
        className={twMerge(
          "flex items-baseline gap-1.5 text-xs text-gray-500 dark:text-gray-400",
          (subtotal || total) && "font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300",
        )}
      >
        {addition && <span>+</span>}
        {label}
        {note && (
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-semibold normal-case tracking-normal text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            {note}
          </span>
        )}
      </span>
      <span className="flex items-baseline gap-3">
        <Figure
          value={value}
          unit={unit}
          className={twMerge(
            addition && "text-gray-500 dark:text-gray-400",
            subtotal && "font-bold text-gray-800 dark:text-gray-100",
            total && "text-lg font-bold text-gray-900 dark:text-white",
          )}
        />
        {duration && (
          <span className="min-w-12 text-right font-mono tabular-nums text-xs text-gray-400 dark:text-gray-500">
            {duration}
          </span>
        )}
      </span>
    </div>
  );
}

type SplitEntry = {
  caption: string;
  value: number;
};

export function BuildUpSplitLine({ label, entries }: { label: string; entries: SplitEntry[] }) {
  return (
    <div className="mt-0.5 flex flex-wrap items-baseline justify-between gap-x-3 border-t border-gray-200 py-0.5 pt-1.5 dark:border-gray-800">
      <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">{label}</span>
      <span className="flex flex-wrap items-baseline justify-end gap-x-4">
        {entries.map(({ caption, value }) => (
          <span key={caption} className="flex items-baseline gap-1.5">
            <span className="text-[11px] text-gray-500 dark:text-gray-400">{caption}</span>
            <Figure value={value} className="font-bold text-gray-800 dark:text-gray-100" />
          </span>
        ))}
      </span>
    </div>
  );
}
