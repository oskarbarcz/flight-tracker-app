import React from "react";
import { DeltaBadge } from "~/features/stats/components/Activity/DeltaBadge";
import { useTweenedNumber } from "~/features/stats/hooks/useTweenedNumber";
import { compareToPrevious } from "~/features/stats/lib/delta";
import { METRICS, type Metric, type MetricKey, type MetricReading } from "~/features/stats/lib/metrics";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Props = {
  readings: Record<MetricKey, MetricReading>;
  previousLabel: string;
  hasBaselineData: boolean;
  unavailableNote: string | null;
  detailed: boolean;
};

type RowProps = {
  metric: Metric;
  reading: MetricReading;
  previousLabel: string;
  hasBaselineData: boolean;
  detailed: boolean;
};

function MetricRow({ metric, reading, previousLabel, hasBaselineData, detailed }: RowProps) {
  const tweened = useTweenedNumber(reading.available ? reading.current : 0);
  const comparison = reading.available && hasBaselineData ? reading.previous : null;

  return (
    <div className="flex min-h-10 flex-col justify-center gap-1.5 border-t border-gray-100 py-2.5 first:border-t-0 dark:border-gray-800">
      <div className="flex items-baseline justify-between gap-3">
        <FieldLabel>{metric.label}</FieldLabel>
        {reading.available ? (
          <span className="whitespace-nowrap font-mono text-base font-bold tabular-nums text-gray-900 dark:text-white">
            {metric.format(tweened)}
            {metric.unit && (
              <span className="ms-0.5 text-[11px] font-normal text-gray-500 dark:text-gray-400">{metric.unit}</span>
            )}
          </span>
        ) : (
          <span className="font-mono text-base font-bold text-gray-400 dark:text-gray-600">&mdash;</span>
        )}
      </div>

      {detailed && comparison !== null && (
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 truncate font-mono text-[11px] tabular-nums text-gray-500 dark:text-gray-400">
            {`${metric.format(comparison)}${metric.unit ?? ""} in ${previousLabel}`}
          </span>
          <DeltaBadge
            delta={compareToPrevious(reading.available ? reading.current : 0, comparison, {
              floor: metric.floor,
              hasBaselineData,
            })}
            format={metric.format}
          />
        </div>
      )}
    </div>
  );
}

export function ladderHasDetails(
  readings: Record<MetricKey, MetricReading>,
  hasBaselineData: boolean,
  unavailableNote: string | null,
): boolean {
  if (unavailableNote !== null) {
    return true;
  }

  return METRICS.some((metric) => {
    const reading = readings[metric.key];
    return reading.available && reading.previous !== null && hasBaselineData;
  });
}

export function MetricLadder({ readings, previousLabel, hasBaselineData, unavailableNote, detailed }: Props) {
  return (
    <>
      <div className="flex flex-col">
        {METRICS.map((metric) => (
          <MetricRow
            key={metric.key}
            metric={metric}
            reading={readings[metric.key]}
            previousLabel={previousLabel}
            hasBaselineData={hasBaselineData}
            detailed={detailed}
          />
        ))}
      </div>

      {detailed && unavailableNote !== null && (
        <span className="mt-2 border-t border-gray-100 pt-2 text-[11px] leading-4 text-gray-500 dark:border-gray-800 dark:text-gray-400">
          {unavailableNote}
        </span>
      )}
    </>
  );
}
