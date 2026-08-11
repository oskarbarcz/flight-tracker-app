import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  columns: 2 | 3;
  children: React.ReactNode;
};

export function FormGrid({ columns, children }: Props) {
  return <div className={twMerge("grid gap-4", columns === 2 ? "grid-cols-2" : "grid-cols-3")}>{children}</div>;
}
