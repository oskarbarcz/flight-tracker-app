"use client";

import React from "react";
import type { IconType } from "react-icons";
import { FaCheckCircle, FaExclamationCircle, FaQuestionCircle } from "react-icons/fa";
import { FaPlane, FaStopwatch } from "react-icons/fa6";
import type { FilledSchedule, Flight } from "~/models";

type Props = {
  flight: Flight;
};

function durationMinutes(start: Date, end: Date): number {
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60_000));
}

function formatHm(minutes: number): string {
  return `${Math.floor(minutes / 60)}h ${(minutes % 60).toString().padStart(2, "0")}m`;
}

function isFilled(s: Flight["timesheet"]["actual"]): s is FilledSchedule {
  return Boolean(s?.offBlockTime && s.takeoffTime && s.arrivalTime && s.onBlockTime);
}

type Tone = "indigo" | "emerald" | "amber" | "gray";

const TONE: Record<Tone, { ring: string; iconBg: string; iconFg: string; value: string }> = {
  indigo: {
    ring: "ring-indigo-100 dark:ring-indigo-900/50",
    iconBg: "bg-indigo-100 dark:bg-indigo-950",
    iconFg: "text-indigo-500",
    value: "text-gray-900 dark:text-white",
  },
  emerald: {
    ring: "ring-emerald-100 dark:ring-emerald-900/50",
    iconBg: "bg-emerald-100 dark:bg-emerald-950",
    iconFg: "text-emerald-500",
    value: "text-emerald-600 dark:text-emerald-300",
  },
  amber: {
    ring: "ring-amber-100 dark:ring-amber-900/50",
    iconBg: "bg-amber-100 dark:bg-amber-950",
    iconFg: "text-amber-500",
    value: "text-amber-600 dark:text-amber-300",
  },
  gray: {
    ring: "ring-gray-100 dark:ring-gray-800",
    iconBg: "bg-gray-100 dark:bg-gray-800",
    iconFg: "text-gray-400",
    value: "text-gray-500 dark:text-gray-400",
  },
};

export function HeadlineStats({ flight }: Props) {
  const { scheduled, estimated, actual } = flight.timesheet;
  const actualFilled = isFilled(actual) ? actual : null;

  // Compare against the revised flight plan (estimated) when it exists; fall
  // back to the originally scheduled plan if no estimate was filed.
  const baseline = estimated ?? scheduled;
  const baselineLabel = estimated ? "Estimated" : "Scheduled";
  const baselineLowercase = estimated ? "estimated" : "scheduled";

  const baselineBlock = durationMinutes(baseline.offBlockTime, baseline.onBlockTime);
  const baselineAir = durationMinutes(baseline.takeoffTime, baseline.arrivalTime);

  const actualBlock = actualFilled ? durationMinutes(actualFilled.offBlockTime, actualFilled.onBlockTime) : null;
  const actualAir = actualFilled ? durationMinutes(actualFilled.takeoffTime, actualFilled.arrivalTime) : null;

  const arrivalDeltaMin = actualFilled
    ? Math.round((actualFilled.onBlockTime.getTime() - baseline.onBlockTime.getTime()) / 60_000)
    : null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Tile
        icon={FaStopwatch}
        tone="indigo"
        label="Block time"
        value={actualBlock !== null ? formatHm(actualBlock) : "—"}
        sub={`${baselineLabel} ${formatHm(baselineBlock)}`}
      />
      <Tile
        icon={FaPlane}
        tone="indigo"
        label="Air time"
        value={actualAir !== null ? formatHm(actualAir) : "—"}
        sub={`${baselineLabel} ${formatHm(baselineAir)}`}
      />
      <ArrivalTile deltaMin={arrivalDeltaMin} baselineLabel={baselineLowercase} />
    </div>
  );
}

function Tile({
  icon: Icon,
  tone,
  label,
  value,
  sub,
}: {
  icon: IconType;
  tone: Tone;
  label: string;
  value: string;
  sub: string;
}) {
  const t = TONE[tone];
  return (
    <section className={`flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ${t.ring} dark:bg-gray-900`}>
      <div className={`grid size-12 shrink-0 place-items-center rounded-xl ${t.iconBg}`}>
        <Icon className={t.iconFg} size={20} />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-bold uppercase tracking-wider text-gray-500">{label}</div>
        <div className={`mt-0.5 font-mono text-2xl font-bold ${t.value}`}>{value}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{sub}</div>
      </div>
    </section>
  );
}

function ArrivalTile({ deltaMin, baselineLabel }: { deltaMin: number | null; baselineLabel: string }) {
  if (deltaMin === null) {
    return <Tile icon={FaQuestionCircle} tone="gray" label="Arrival" value="—" sub="No actual times recorded" />;
  }

  // Treat ±5 minutes as on time.
  const onTime = Math.abs(deltaMin) <= 5;
  const late = deltaMin > 5;

  if (onTime) {
    return (
      <Tile
        icon={FaCheckCircle}
        tone="emerald"
        label="Arrival"
        value="On time"
        sub={deltaLabel(deltaMin, baselineLabel)}
      />
    );
  }
  if (late) {
    return (
      <Tile
        icon={FaExclamationCircle}
        tone="amber"
        label="Arrival"
        value={`${deltaMin}m late`}
        sub={`vs. ${baselineLabel} on-block`}
      />
    );
  }
  return (
    <Tile
      icon={FaCheckCircle}
      tone="emerald"
      label="Arrival"
      value={`${Math.abs(deltaMin)}m early`}
      sub={`vs. ${baselineLabel} on-block`}
    />
  );
}

function deltaLabel(deltaMin: number, baselineLabel: string): string {
  if (deltaMin === 0) return `exactly on ${baselineLabel}`;
  return `${deltaMin > 0 ? "+" : ""}${deltaMin}m vs. ${baselineLabel}`;
}
