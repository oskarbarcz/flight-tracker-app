import React from "react";
import type { IconType } from "react-icons";
import { FaCheckCircle, FaExclamationCircle, FaQuestionCircle } from "react-icons/fa";
import { FaPlane, FaStopwatch } from "react-icons/fa6";
import type { FilledSchedule, Flight } from "~/features/flight";
import { durationMinutes, formatDuration } from "~/shared/lib/time";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

type Props = {
  flight: Flight;
};

function isFilled(s: Flight["timesheet"]["actual"]): s is FilledSchedule {
  return Boolean(s?.offBlockTime && s.takeoffTime && s.arrivalTime && s.onBlockTime);
}

type Tone = "indigo" | "emerald" | "amber" | "gray";

const TONE: Record<Tone, string> = {
  indigo: "text-gray-900 dark:text-white",
  emerald: "text-emerald-600 dark:text-emerald-300",
  amber: "text-amber-600 dark:text-amber-400",
  gray: "text-gray-500 dark:text-gray-400",
};

export function HeadlineStats({ flight }: Props) {
  const { scheduled, estimated, actual } = flight.timesheet;
  const actualFilled = isFilled(actual) ? actual : null;

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
        value={actualBlock !== null ? formatDuration(actualBlock) : "—"}
        sub={`${baselineLabel} ${formatDuration(baselineBlock)}`}
      />
      <Tile
        icon={FaPlane}
        tone="indigo"
        label="Air time"
        value={actualAir !== null ? formatDuration(actualAir) : "—"}
        sub={`${baselineLabel} ${formatDuration(baselineAir)}`}
      />
      <ArrivalTile deltaMin={arrivalDeltaMin} baselineLabel={baselineLowercase} />
    </div>
  );
}

function Tile({
  icon,
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
  return (
    <Container padding="normal">
      <ContainerTitle icon={icon} title={label} />
      <div>
        <div className={`font-mono text-2xl font-bold ${TONE[tone]}`}>{value}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{sub}</div>
      </div>
    </Container>
  );
}

function ArrivalTile({ deltaMin, baselineLabel }: { deltaMin: number | null; baselineLabel: string }) {
  if (deltaMin === null) {
    return <Tile icon={FaQuestionCircle} tone="gray" label="Arrival" value="—" sub="No actual times recorded" />;
  }

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
