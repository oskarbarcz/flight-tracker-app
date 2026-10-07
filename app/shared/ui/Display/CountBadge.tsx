import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  count: number;
  size?: "sm" | "md";
  className?: string;
};

const SIZES = {
  sm: "h-4 min-w-4 px-1 text-2xs leading-none",
  md: "h-5 min-w-5 px-1.5 text-xs",
};

export function CountBadge({ count, size = "md", className }: Props) {
  return (
    <span
      className={twMerge(
        "inline-flex items-center justify-center rounded-full bg-amber-700 font-bold text-white",
        SIZES[size],
        className,
      )}
    >
      {count}
    </span>
  );
}
