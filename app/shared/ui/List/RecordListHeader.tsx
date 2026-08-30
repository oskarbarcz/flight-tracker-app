import React from "react";
import type { RecordListLayout } from "~/shared/ui/List/recordListLayout";

type Props = {
  layout: RecordListLayout;
};

export function RecordListHeader({ layout }: Props) {
  return (
    <div
      className={`${layout.grid} border-b border-gray-200 bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400`}
      aria-hidden
    >
      {layout.headers.map((header) => (
        <span key={header} className="px-1 py-2.5 sm:px-3">
          {header}
        </span>
      ))}
      <span className={`${layout.headerTrailingClassName} px-1 py-2.5 sm:px-3`}>{layout.trailingHeader}</span>
      <span className={layout.chevronClassName} />
    </div>
  );
}
