import React from "react";
import { DeltaBadge } from "~/features/stats/components/Activity/DeltaBadge";
import { useTweenedNumber } from "~/features/stats/hooks/useTweenedNumber";
import type { Delta } from "~/features/stats/lib/delta";
import { formatDuration } from "~/shared/lib/time";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

export type YearOverYear = {
  label: string;
  blockMinutes: number;
  delta: Delta;
};

type Props = {
  blockMinutes: number;
  previousBlockMinutes: number;
  previousLabel: string;
  hasBaselineData: boolean;
  delta: Delta;
  yearOverYear: YearOverYear | null;
  detailed: boolean;
};

export function BlockTimeSummary({
  blockMinutes,
  previousBlockMinutes,
  previousLabel,
  hasBaselineData,
  delta,
  yearOverYear,
  detailed,
}: Props) {
  const tweened = useTweenedNumber(blockMinutes);

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>Block time</FieldLabel>

      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-3xl font-bold leading-none tabular-nums text-gray-900 dark:text-white">
          {formatDuration(tweened)}
        </span>
        {hasBaselineData && <DeltaBadge delta={delta} format={formatDuration} />}
      </div>

      {detailed && (
        <div className="flex flex-col">
          <div className="flex min-h-5 items-center justify-between gap-2">
            <span className="shrink-0 text-[11px] text-gray-500 dark:text-gray-400">vs {previousLabel}</span>
            <span className="font-mono text-[11px] tabular-nums text-gray-600 dark:text-gray-300">
              {hasBaselineData ? formatDuration(previousBlockMinutes) : "no earlier data"}
            </span>
          </div>

          <div className="flex min-h-6 items-center justify-between gap-2">
            {yearOverYear === null ? (
              <span className="text-[11px] text-gray-400 dark:text-gray-600">&nbsp;</span>
            ) : (
              <>
                <span className="shrink-0 text-[11px] text-gray-500 dark:text-gray-400">vs {yearOverYear.label}</span>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[11px] tabular-nums text-gray-600 dark:text-gray-300">
                    {formatDuration(yearOverYear.blockMinutes)}
                  </span>
                  <DeltaBadge delta={yearOverYear.delta} format={formatDuration} />
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
