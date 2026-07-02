import React from "react";

type Props = {
  title: string;
  value: string;
};

export function SimpleStatDisplay({ title, value }: Props) {
  return (
    <div className="px-4 first:pl-0 last:pr-0">
      <h3 className="whitespace-nowrap text-[10px] font-bold uppercase tracking-wider text-gray-500">{title}</h3>
      <span className="text-base font-bold text-gray-700 dark:text-gray-300">{value}</span>
    </div>
  );
}
