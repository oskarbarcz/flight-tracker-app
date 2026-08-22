import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  label: string;
  className?: string;
};

export function SweepTrack({ label, className }: Props) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      className={twMerge(
        "sweep-track h-1 w-full rounded-full bg-gray-200 text-indigo-500 dark:bg-gray-800 dark:text-indigo-400",
        className,
      )}
    />
  );
}
