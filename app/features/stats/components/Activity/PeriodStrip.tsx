import React from "react";

type Props = {
  segments: React.ReactNode;
  position: React.ReactNode;
  extent: React.ReactNode;
  rail?: React.ReactNode;
};

export function PeriodStrip({ segments, position, extent, rail }: Props) {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex min-h-12 flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2">
        {segments}
        <div className="flex min-h-9 min-w-0 items-center">{position}</div>
        <div className="ms-auto flex items-center">{extent}</div>
      </div>

      {rail !== undefined && <div className="border-t border-gray-100 px-3 pb-2 pt-2 dark:border-gray-800">{rail}</div>}
    </div>
  );
}
