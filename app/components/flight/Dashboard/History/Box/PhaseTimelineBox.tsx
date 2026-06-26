import React from "react";
import { FaStopwatch } from "react-icons/fa6";
import { HiInformationCircle } from "react-icons/hi";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import { Container } from "~/components/shared/Layout/Container";
import { ContainerTitle } from "~/components/shared/Layout/ContainerTitle";
import { durationMinutes, formatDuration } from "~/functions/time";
import type { FilledSchedule, Flight, Schedule } from "~/models";

type Props = {
  flight: Flight;
};

type PhaseKey = "off" | "out" | "in" | "on";
type ScheduleField = "offBlockTime" | "takeoffTime" | "arrivalTime" | "onBlockTime";

const PHASES: { key: PhaseKey; label: string; field: ScheduleField }[] = [
  { key: "off", label: "Off-block", field: "offBlockTime" },
  { key: "out", label: "Takeoff", field: "takeoffTime" },
  { key: "in", label: "Arrival", field: "arrivalTime" },
  { key: "on", label: "On-block", field: "onBlockTime" },
];

function pickDate(s: Schedule | FilledSchedule | undefined, field: ScheduleField): Date | null {
  return s?.[field] ?? null;
}

function deltaMin(a: Date | null, b: Date | null): number | null {
  if (!a || !b) return null;
  return Math.round((a.getTime() - b.getTime()) / 60_000);
}

function durationMin(start: Date | null | undefined, end: Date | null | undefined): number | null {
  if (!start || !end) return null;
  return durationMinutes(start, end);
}

function formatHm(minutes: number | null): string {
  return minutes === null ? "—" : formatDuration(minutes);
}

function hasAnyTime(s: Schedule | undefined): boolean {
  if (!s) return false;
  return Boolean(s.offBlockTime || s.takeoffTime || s.arrivalTime || s.onBlockTime);
}

function describeDelta(minutes: number, baselineLabel: string): string {
  const abs = Math.abs(minutes);
  const unit = abs === 1 ? "minute" : "minutes";
  const direction = minutes > 0 ? "later than" : "before";
  return `${abs} ${unit} ${direction} ${baselineLabel}`;
}

export function PhaseTimelineBox({ flight }: Props) {
  const { scheduled, estimated, actual } = flight.timesheet;
  const actualPresent = hasAnyTime(actual);

  const baseline: Schedule | undefined = estimated ?? scheduled;
  const baselineLabel = estimated ? "estimation" : "schedule";

  return (
    <Container padding="spacious">
      <ContainerTitle icon={FaStopwatch} title="Phase timeline" />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PHASES.map((p) => (
          <PhaseCallout
            key={p.key}
            label={p.label}
            actualDate={pickDate(actual, p.field)}
            baselineDate={pickDate(baseline, p.field)}
            baselineLabel={baselineLabel}
          />
        ))}
      </div>

      <div className="space-y-2">
        <DurationRow
          label="Block time"
          actualMin={durationMin(actual?.offBlockTime, actual?.onBlockTime)}
          estimatedMin={durationMin(estimated?.offBlockTime, estimated?.onBlockTime)}
          scheduledMin={durationMin(scheduled.offBlockTime, scheduled.onBlockTime)}
          baselineMin={durationMin(baseline?.offBlockTime, baseline?.onBlockTime)}
          baselineLabel={baselineLabel}
        />
        <DurationRow
          label="Air time"
          actualMin={durationMin(actual?.takeoffTime, actual?.arrivalTime)}
          estimatedMin={durationMin(estimated?.takeoffTime, estimated?.arrivalTime)}
          scheduledMin={durationMin(scheduled.takeoffTime, scheduled.arrivalTime)}
          baselineMin={durationMin(baseline?.takeoffTime, baseline?.arrivalTime)}
          baselineLabel={baselineLabel}
        />
      </div>

      {!actualPresent && (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50/50 px-3 py-2 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900/30 dark:text-gray-400">
          <HiInformationCircle className="size-4 shrink-0 text-gray-400" />
          <span>No actual times were recorded for this flight.</span>
        </div>
      )}
    </Container>
  );
}

function PhaseCallout({
  label,
  actualDate,
  baselineDate,
  baselineLabel,
}: {
  label: string;
  actualDate: Date | null;
  baselineDate: Date | null;
  baselineLabel: string;
}) {
  const delta = deltaMin(actualDate, baselineDate);
  const hasDelta = delta !== null && delta !== 0;
  return (
    <div className="rounded-xl bg-gray-50 px-4 py-3 text-center dark:bg-gray-950">
      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</div>
      <div className="mt-1 font-mono text-lg font-bold text-gray-900 dark:text-white">
        {actualDate ? <FormattedIcaoTime date={actualDate} /> : <Empty />}
      </div>
      {hasDelta && (
        <div
          className={`mt-1 text-[11px] leading-tight ${
            delta > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-300"
          }`}
        >
          {describeDelta(delta, baselineLabel)}
        </div>
      )}
    </div>
  );
}

function DurationRow({
  label,
  actualMin,
  estimatedMin,
  scheduledMin,
  baselineMin,
  baselineLabel,
}: {
  label: string;
  actualMin: number | null;
  estimatedMin: number | null;
  scheduledMin: number | null;
  baselineMin: number | null;
  baselineLabel: string;
}) {
  const delta = actualMin !== null && baselineMin !== null ? actualMin - baselineMin : null;
  const hasDelta = delta !== null && delta !== 0;
  return (
    <div className="rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-950">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</span>
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-xs">
          <TotalCell label="Actual" value={formatHm(actualMin)} strong />
          <TotalCell label="Estimated" value={formatHm(estimatedMin)} />
          <TotalCell label="Scheduled" value={formatHm(scheduledMin)} muted />
        </div>
      </div>
      {hasDelta && (
        <div
          className={`mt-2 text-[11px] ${
            delta > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-300"
          }`}
        >
          {describeDelta(delta, baselineLabel)}
        </div>
      )}
    </div>
  );
}

function TotalCell({
  label,
  value,
  strong,
  muted,
}: {
  label: string;
  value: string;
  strong?: boolean;
  muted?: boolean;
}) {
  const labelClass = muted ? "text-gray-400 dark:text-gray-500" : "text-gray-500";
  const valueClass = strong
    ? "font-mono text-base font-bold text-gray-900 dark:text-white"
    : muted
      ? "font-mono text-gray-400 dark:text-gray-500"
      : "font-mono text-gray-600 dark:text-gray-300";
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className={labelClass}>{label}</span>
      <span className={valueClass}>{value}</span>
    </span>
  );
}

function Empty() {
  return <span className="text-gray-400">—</span>;
}
