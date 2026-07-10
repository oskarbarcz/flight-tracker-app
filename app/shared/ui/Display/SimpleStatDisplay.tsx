import React from "react";

type Props = {
  title: string;
  value: string;
};

export function SimpleStatDisplay({ title, value }: Props) {
  return (
    <div className="px-4 first:pl-0 last:pr-0">
      <span className="block whitespace-nowrap text-[11px] font-bold uppercase tracking-wider text-gray-500">
        {title}
      </span>
      <span className="text-base font-bold font-mono tabular-nums text-gray-700 dark:text-gray-300">{value}</span>
    </div>
  );
}
