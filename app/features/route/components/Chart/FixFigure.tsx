import React from "react";
import { twMerge } from "tailwind-merge";
import { ABSENT } from "~/features/route/lib/routeFigures";

export const FIXED_FIGURE = "font-mono text-sm font-medium tabular-nums text-gray-800 dark:text-gray-100";
export const FIXED_SUFFIX = "ms-1 text-2xs font-normal text-gray-500 dark:text-gray-400";
export const FIX_GRID = "grid grid-cols-2 gap-x-2 gap-y-1.5 min-[360px]:grid-cols-[1fr_1.1fr_1.25fr_3.75rem]";

type Props = {
  label: string;
  value: string;
  suffix?: string | null;
  icon?: React.ReactNode;
  valueClassName?: string;
  className?: string;
};

export function FixFigure({ label, value, suffix, icon, valueClassName, className }: Props) {
  return (
    <div className={className}>
      <dt className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className={twMerge(FIXED_FIGURE, "whitespace-nowrap", valueClassName)}>
        {icon}
        {value}
        {suffix && value !== ABSENT && <span className={FIXED_SUFFIX}>{suffix}</span>}
      </dd>
    </div>
  );
}
