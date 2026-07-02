import React from "react";

type Props = {
  label: string;
  value: string;
  mono?: boolean;
};

export function DataField({ label, value, mono = false }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 shadow-[0_1px_2px_rgb(15_23_42/0.04),0_6px_16px_-8px_rgb(15_23_42/0.12)] dark:shadow-none">
      <div className="text-[10px] uppercase text-gray-500 tracking-wider font-medium">{label}</div>
      <div className={`text-sm font-bold text-gray-900 dark:text-gray-100 ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}
