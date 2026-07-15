import type React from "react";
import { type Flight, FlightStatus } from "~/features/flight";
import { PhaseCountdown } from "~/features/flight/components/Dashboard/Tracking/Progress/PhaseCountdown";
import { getTimeDifferenceInHours, timeDiff } from "~/shared/lib/time";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { MetaRow } from "~/shared/ui/Display/MetaRow";

const OFF_BLOCK_STATUSES = [
  FlightStatus.Ready,
  FlightStatus.CheckedIn,
  FlightStatus.BoardingStarted,
  FlightStatus.BoardingFinished,
];

const FLIGHT_LOG_STATUSES = [FlightStatus.OnBlock, FlightStatus.OffboardingStarted, FlightStatus.OffboardingFinished];

function timeValue(date: Date | null | undefined): React.ReactNode {
  return date ? <FormattedIcaoTime date={date} /> : <span className="text-gray-400 dark:text-gray-500">—</span>;
}

function dateTimeValue(date: Date | null | undefined): React.ReactNode {
  if (!date) {
    return <span className="text-gray-400 dark:text-gray-500">—</span>;
  }
  return (
    <span className="font-mono tabular-nums">
      <FormattedIcaoDate date={date} /> <FormattedIcaoTime date={date} />
    </span>
  );
}

function durationValue(start: Date | null | undefined, end: Date | null | undefined): React.ReactNode {
  if (!start || !end) {
    return <span className="text-gray-400 dark:text-gray-500">—</span>;
  }
  return <span className="font-mono tabular-nums">{getTimeDifferenceInHours(start, end)}</span>;
}

type Props = {
  flight: Flight;
};

export function PhaseMetrics({ flight }: Props) {
  const scheduled = flight.timesheet.scheduled;
  const actual = flight.timesheet.actual;

  if (flight.status === FlightStatus.Created) {
    return (
      <div>
        <FieldLabel>Status</FieldLabel>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Not yet released by operations</p>
        <div className="mt-3">
          <MetaRow label="Scheduled off-block" value={<FormattedIcaoTime date={scheduled.offBlockTime} />} />
        </div>
      </div>
    );
  }

  if (OFF_BLOCK_STATUSES.includes(flight.status)) {
    return (
      <div className="flex flex-col gap-3">
        <PhaseCountdown label="Time to off-block" targetTime={scheduled.offBlockTime} />
        <MetaRow label="Scheduled off-block" value={<FormattedIcaoTime date={scheduled.offBlockTime} />} />
      </div>
    );
  }

  if (flight.status === FlightStatus.TaxiingOut) {
    return (
      <div className="flex flex-col gap-3">
        <PhaseCountdown label="Time to takeoff" targetTime={scheduled.takeoffTime} />
        <MetaRow label="Scheduled takeoff" value={<FormattedIcaoTime date={scheduled.takeoffTime} />} />
      </div>
    );
  }

  if (flight.status === FlightStatus.InCruise) {
    const estimatedArrival = actual?.takeoffTime
      ? new Date(actual.takeoffTime.getTime() + timeDiff(scheduled.takeoffTime, scheduled.arrivalTime) * 1000)
      : null;
    return (
      <div className="flex flex-col gap-3">
        <PhaseCountdown label="Time to arrival" targetTime={scheduled.arrivalTime} />
        <div className="flex flex-col gap-2">
          <MetaRow label="Estimated arrival" value={dateTimeValue(estimatedArrival)} />
          <MetaRow label="Scheduled arrival" value={dateTimeValue(scheduled.arrivalTime)} />
        </div>
      </div>
    );
  }

  if (flight.status === FlightStatus.TaxiingIn) {
    return (
      <div className="flex flex-col gap-3">
        <PhaseCountdown label="Time to on-block" targetTime={scheduled.onBlockTime} />
        <MetaRow label="Scheduled on-block" value={<FormattedIcaoTime date={scheduled.onBlockTime} />} />
      </div>
    );
  }

  if (FLIGHT_LOG_STATUSES.includes(flight.status)) {
    return (
      <div>
        <FieldLabel>Flight log</FieldLabel>
        <div className="mt-2 flex flex-col gap-2">
          <MetaRow label="Off-block" value={timeValue(actual?.offBlockTime)} />
          <MetaRow label="Takeoff" value={timeValue(actual?.takeoffTime)} />
          <MetaRow label="Arrival" value={timeValue(actual?.arrivalTime)} />
          <MetaRow label="On-block" value={timeValue(actual?.onBlockTime)} />
        </div>
        <div className="mt-2 flex flex-col gap-2 border-t-2 border-gray-300 pt-2 dark:border-gray-600">
          <MetaRow label="Air time" value={durationValue(actual?.takeoffTime, actual?.arrivalTime)} />
          <MetaRow label="Block time" value={durationValue(actual?.offBlockTime, actual?.onBlockTime)} />
        </div>
      </div>
    );
  }

  return null;
}
