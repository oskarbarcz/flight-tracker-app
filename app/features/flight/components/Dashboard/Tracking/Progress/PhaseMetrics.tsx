import React from "react";
import { type Flight, FlightStatus } from "~/features/flight";
import { PhaseCountdown } from "~/features/flight/components/Dashboard/Tracking/Progress/PhaseCountdown";
import { TimeCertaintyMark } from "~/features/flight/components/Dashboard/Tracking/TimeCertaintyMark";
import { type BlockEventKey, resolveBlockTime } from "~/features/flight/lib/blockEvents";
import { isBeforeOffBlock } from "~/features/flight/lib/flightPhase";
import { durationMinutes, formatDuration } from "~/shared/lib/time";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

const EVENT_LABELS: Record<BlockEventKey, string> = {
  offBlockTime: "Off-block",
  takeoffTime: "Takeoff",
  arrivalTime: "Arrival",
  onBlockTime: "On-block",
};

const NEXT_EVENTS: Partial<Record<FlightStatus, BlockEventKey>> = {
  [FlightStatus.TaxiingOut]: "takeoffTime",
  [FlightStatus.InCruise]: "arrivalTime",
  [FlightStatus.TaxiingIn]: "onBlockTime",
};

function nextEvent(status: FlightStatus): BlockEventKey | null {
  return isBeforeOffBlock(status) ? "offBlockTime" : (NEXT_EVENTS[status] ?? null);
}

function durationOrDash(start: Date | null | undefined, end: Date | null | undefined): string {
  return start && end ? formatDuration(durationMinutes(start, end)) : "—";
}

type Props = {
  flight: Flight;
  className?: string;
};

export function PhaseMetrics({ flight, className }: Props) {
  const { scheduled, actual } = flight.timesheet;
  const event = nextEvent(flight.status);

  if (event !== null) {
    return (
      <div className={className}>
        <PhaseCountdown event={EVENT_LABELS[event]} target={resolveBlockTime(event, flight.timesheet)} />
      </div>
    );
  }

  return (
    <div className={className}>
      <FieldLabel>Block time</FieldLabel>
      <span className="mt-1 block font-mono text-3xl font-bold leading-none tabular-nums text-gray-900 dark:text-gray-100">
        {durationOrDash(actual?.offBlockTime, actual?.onBlockTime)}
      </span>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500 dark:text-gray-400">
        <span className="whitespace-nowrap">
          Air time{" "}
          <span className="font-mono tabular-nums text-gray-700 dark:text-gray-200">
            {durationOrDash(actual?.takeoffTime, actual?.arrivalTime)}
          </span>
        </span>
        <span className="inline-flex items-center gap-1 whitespace-nowrap">
          <TimeCertaintyMark certainty="scheduled" />
          <span className="font-mono tabular-nums text-gray-700 dark:text-gray-200">
            {durationOrDash(scheduled.offBlockTime, scheduled.onBlockTime)}
          </span>
        </span>
      </div>
    </div>
  );
}
