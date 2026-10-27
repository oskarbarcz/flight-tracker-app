import React from "react";

type Props = {
  value: string;
  unit: string;
  label: string;
};

export function Quantity({ value, unit, label }: Props) {
  return (
    <span className="whitespace-nowrap">
      <span className="font-mono text-sm font-bold tabular-nums text-gray-900 dark:text-white">{value}</span>
      <span className="ms-0.5 font-mono text-2xs text-gray-500 dark:text-gray-400">{unit}</span>
      <span className="ms-1 text-xs text-gray-500 dark:text-gray-400">{label}</span>
    </span>
  );
}
