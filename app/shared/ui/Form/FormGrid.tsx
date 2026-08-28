import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  columns: 2 | 3 | 4;
  children: React.ReactNode;
};

const columnClasses: Record<2 | 3 | 4, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
};

export function FormGrid({ columns, children }: Props) {
  return <div className={twMerge("grid gap-4", columnClasses[columns])}>{children}</div>;
}
