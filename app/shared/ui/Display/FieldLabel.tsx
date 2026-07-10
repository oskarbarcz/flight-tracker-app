import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function FieldLabel({ children, className }: Props) {
  return (
    <span
      className={twMerge(
        "block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400",
        className,
      )}
    >
      {children}
    </span>
  );
}
