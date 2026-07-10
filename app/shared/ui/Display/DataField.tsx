import React from "react";

type Props = {
  label: string;
  value: string;
  mono?: boolean;
};

export function DataField({ label, value, mono = false }: Props) {
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 pb-1.5">
      <div className="text-[10px] uppercase text-gray-500 dark:text-gray-400 tracking-wider font-medium">{label}</div>
      <div className={`text-sm font-bold text-gray-900 dark:text-gray-100 ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}
