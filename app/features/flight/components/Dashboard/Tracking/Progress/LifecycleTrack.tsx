import React from "react";
import { LuCheck } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import { type FlightServiceType, FlightStatus } from "~/features/flight";
import { TimeCertaintyMark } from "~/features/flight/components/Dashboard/Tracking/TimeCertaintyMark";
import {
  type LifecycleSpan,
  LifecycleStage,
  type LifecycleStep,
  type LifecycleValue,
} from "~/features/flight/lib/lifecycle";
import { toHuman } from "~/i18n/translate";
import { useDateProgress } from "~/shared/hooks/useDateProgress";
import { formatDuration } from "~/shared/lib/time";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";

const CURRENT_STAGE_SHARE = 4;

function stageLabel(stage: LifecycleStage, serviceType: FlightServiceType): string {
  const labels: Record<LifecycleStage, string> = {
    [LifecycleStage.CheckIn]: "Check-in",
    [LifecycleStage.Boarding]: toHuman.flight.status.short(FlightStatus.BoardingStarted, serviceType),
    [LifecycleStage.OffBlock]: "Off-block",
    [LifecycleStage.Takeoff]: "Takeoff",
    [LifecycleStage.Cruise]: "Cruise",
    [LifecycleStage.Arrival]: "Arrival",
    [LifecycleStage.OnBlock]: "On-block",
    [LifecycleStage.Offboarding]: toHuman.flight.status.short(FlightStatus.OffboardingStarted, serviceType),
    [LifecycleStage.Close]: "Close",
  };

  return labels[stage];
}

function StepValue({ value, reached }: { value: LifecycleValue | null; reached: boolean }) {
  if (value === null && reached) {
    return (
      <span className="inline-flex items-center gap-1 text-gray-900 dark:text-gray-100">
        <LuCheck className="size-3" aria-hidden={true} />
        <span className="sr-only">Done, time not recorded</span>
      </span>
    );
  }

  if (value === null) {
    return <span className="text-gray-500 dark:text-gray-400">—</span>;
  }

  return (
    <span
      className={twMerge(
        "inline-flex items-center gap-1 whitespace-nowrap tabular-nums",
        value.provenance === "actual" ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400",
      )}
    >
      {value.provenance !== "actual" && <TimeCertaintyMark certainty={value.provenance} />}
      {value.kind === "time" ? (
        <FormattedIcaoTime date={value.at} />
      ) : (
        <span className="font-mono">{formatDuration(value.minutes)}</span>
      )}
    </span>
  );
}

function SpanBar({ span, label }: { span: LifecycleSpan; label: string }) {
  const percent = Math.round(useDateProgress(span.from, span.to));

  return (
    <span
      role="progressbar"
      aria-label={`${label} progress`}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className="block h-1.5 overflow-hidden rounded-full bg-indigo-100 dark:bg-indigo-500/25"
    >
      <span
        className="block h-full rounded-full bg-indigo-500 motion-safe:transition-[width] motion-safe:duration-500"
        style={{ width: `${percent}%` }}
      />
    </span>
  );
}

function StepBar({ step, label }: { step: LifecycleStep; label: string }) {
  if (step.progress === "current" && step.span !== null) {
    return <SpanBar span={step.span} label={label} />;
  }

  return (
    <span
      aria-hidden={true}
      className={twMerge(
        "block h-1.5 rounded-full",
        step.progress === "done" && "bg-gray-400 dark:bg-gray-500",
        step.progress === "current" && "bg-indigo-500",
        step.progress === "upcoming" && "bg-gray-200 dark:bg-gray-700",
      )}
    />
  );
}

function trackColumns(steps: LifecycleStep[]): string {
  return steps
    .map(({ progress }) => `minmax(min-content, ${progress === "current" ? CURRENT_STAGE_SHARE : 1}fr)`)
    .join(" ");
}

type Props = {
  steps: LifecycleStep[];
  serviceType: FlightServiceType;
  compact?: boolean;
  className?: string;
};

export function LifecycleTrack({ steps, serviceType, compact = false, className }: Props) {
  return (
    <ol
      aria-label="Flight lifecycle"
      className={twMerge("grid gap-1.5", className)}
      style={{ gridTemplateColumns: trackColumns(steps) }}
    >
      {steps.map((step) => {
        const current = step.progress === "current";
        const label = stageLabel(step.stage, serviceType);

        return (
          <li key={step.stage} aria-current={current ? "step" : undefined} className="flex min-w-0 flex-col gap-2">
            <StepBar step={step} label={label} />
            <span className={twMerge("sr-only flex-col gap-1", !compact && "@2xl:not-sr-only @2xl:flex")}>
              <span
                className={twMerge(
                  "whitespace-nowrap text-2xs font-bold uppercase tracking-wide",
                  current ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400",
                )}
              >
                {label}
              </span>
              <span className="text-xs">
                <StepValue value={step.value} reached={step.progress !== "upcoming"} />
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
