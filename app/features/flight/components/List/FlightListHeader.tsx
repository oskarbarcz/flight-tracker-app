import React from "react";
import type { FlightListTrailingColumn } from "~/features/flight/components/List/FlightListColumns";

type Props = {
  trailingColumn: FlightListTrailingColumn;
};

export function FlightListHeader({ trailingColumn }: Props) {
  return (
    <div
      className={`${trailingColumn.grid} border-b border-gray-200 bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400`}
      aria-hidden
    >
      <span className="px-1 py-2.5 sm:px-3">Date</span>
      <span className="px-1 py-2.5 sm:px-3">Flight</span>
      <span className="px-1 py-2.5 sm:px-3">Route</span>
      <span className={`${trailingColumn.headerTrailingClassName} px-1 py-2.5 sm:px-3`}>{trailingColumn.header}</span>
      <span className={trailingColumn.chevronClassName} />
    </div>
  );
}
