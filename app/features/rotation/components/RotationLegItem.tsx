import { Button } from "flowbite-react";
import React from "react";
import { FaArrowsSpin } from "react-icons/fa6";
import { FlightStatus } from "~/features/flight";
import type { RotationLeg } from "~/features/rotation";
import { toHuman } from "~/i18n/translate";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Turnaround = {
  minutes: number;
  station: string | null;
};

type Props = {
  index: number;
  leg: RotationLeg;
  isLast: boolean;
  turnaround: Turnaround | null;
  canEdit: boolean;
  canAttach: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onAttach: () => void;
  onDetach: () => void;
};

function formatBlockTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return hours > 0 ? `${hours}h ${remaining}m` : `${remaining}m`;
}

function dayOffset(from: Date, to: Date): number {
  const start = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
  const end = Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate());
  return Math.round((end - start) / 86_400_000);
}

function ScheduleItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <FieldLabel className="inline-block">{label}</FieldLabel>
      <span className="font-mono text-sm font-medium tabular-nums text-gray-700 dark:text-gray-300">{value}</span>
    </div>
  );
}

export function RotationLegItem({
  index,
  leg,
  isLast,
  turnaround,
  canEdit,
  canAttach,
  onEdit,
  onRemove,
  onAttach,
  onDetach,
}: Props) {
  const done = leg.isFlown;
  const arrivalDayOffset = dayOffset(leg.offBlockTime, leg.onBlockTime);
  const flightIsCreated = leg.flight?.status === FlightStatus.Created;
  const canDetach = canAttach && Boolean(leg.flight) && flightIsCreated;

  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center">
        <span
          className={`flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
            done
              ? "bg-indigo-500 text-white dark:bg-indigo-400 dark:text-indigo-950"
              : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300"
          }`}
        >
          {index + 1}
        </span>
        {!isLast && <span className="mt-1 w-px flex-1 bg-gray-200 dark:bg-gray-800" />}
      </div>

      <div className={`min-w-0 flex-1 ${isLast ? "" : "pb-5"}`}>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="flex min-w-0 items-baseline gap-2.5">
            <span className="font-mono text-base font-bold text-gray-900 dark:text-white">{leg.flightNumber}</span>
            <span className="whitespace-nowrap font-mono text-sm font-bold text-gray-700 dark:text-gray-200">
              {leg.departure.iataCode} <span className="text-gray-400">→</span> {leg.arrival.iataCode}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {leg.flight && (
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {toHuman.flight.status.short(leg.flight.status as FlightStatus)}
              </span>
            )}
            {canEdit && (
              <>
                <button
                  type="button"
                  onClick={onEdit}
                  className="cursor-pointer text-sm font-medium text-indigo-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={onRemove}
                  className="cursor-pointer text-sm font-medium text-red-500 hover:underline"
                >
                  Remove
                </button>
              </>
            )}
            {canDetach && (
              <button
                type="button"
                onClick={onDetach}
                className="cursor-pointer text-sm font-medium text-gray-500 hover:underline"
              >
                Detach
              </button>
            )}
            {canAttach && !leg.flight && (
              <Button size="xs" color="indigo" onClick={onAttach}>
                Attach flight
              </Button>
            )}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <ScheduleItem label="OFF" value={<FormattedIcaoTime date={leg.offBlockTime} />} />
          <ScheduleItem
            label="ON"
            value={
              <>
                <FormattedIcaoTime date={leg.onBlockTime} />
                {arrivalDayOffset > 0 && (
                  <sup className="ms-0.5 font-semibold text-gray-400 dark:text-gray-500">(+{arrivalDayOffset})</sup>
                )}
              </>
            }
          />
          <ScheduleItem label="Block" value={formatBlockTime(leg.blockTime)} />
        </div>

        {turnaround && (
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <FaArrowsSpin size={11} className="text-gray-400 dark:text-gray-500" aria-hidden={true} />
            <span className="font-semibold uppercase tracking-wide">Turnaround</span>
            {turnaround.station && (
              <span className="font-mono font-semibold text-gray-600 dark:text-gray-300">{turnaround.station}</span>
            )}
            <span className="text-gray-300 dark:text-gray-600">·</span>
            <span className="font-mono font-semibold text-gray-700 dark:text-gray-200">{turnaround.minutes} min</span>
          </div>
        )}
      </div>
    </li>
  );
}
