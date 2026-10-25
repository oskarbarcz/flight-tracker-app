import { Badge, ToggleSwitch } from "flowbite-react";
import { useFormikContext } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { LuTriangleAlert } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import { TimeCertaintyMark } from "~/features/flight/components/Dashboard/Tracking/TimeCertaintyMark";
import type { BlockEventKey } from "~/features/flight/lib/blockEvents";
import type { FilledSchedule } from "~/features/flight/model";
import { formatCompactDuration, getTimeDifferenceInMinutes } from "~/shared/lib/time";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { ManagedDateTimeInputBlock } from "~/shared/ui/Form/Managed/ManagedDateTimeInputBlock";

const BLOCK_EVENTS: { key: BlockEventKey; label: string }[] = [
  { key: "offBlockTime", label: "Off-block" },
  { key: "takeoffTime", label: "Takeoff" },
  { key: "arrivalTime", label: "Arrival" },
  { key: "onBlockTime", label: "On-block" },
];

const LATER_EVENTS: BlockEventKey[] = ["takeoffTime", "arrivalTime", "onBlockTime"];

const SEGMENTS: { label: string; from: BlockEventKey; to: BlockEventKey }[] = [
  { label: "Taxi out", from: "offBlockTime", to: "takeoffTime" },
  { label: "Air time", from: "takeoffTime", to: "arrivalTime" },
  { label: "Taxi in", from: "arrivalTime", to: "onBlockTime" },
];

function asDate(value: unknown): Date | null {
  return value instanceof Date && !Number.isNaN(value.getTime()) ? value : null;
}

function minutesBetween(from: unknown, to: unknown): number | null {
  const start = asDate(from);
  const end = asDate(to);

  return start === null || end === null ? null : getTimeDifferenceInMinutes(start, end);
}

function Deviation({ scheduled, estimated }: { scheduled: Date; estimated: unknown }) {
  const minutes = minutesBetween(scheduled, estimated);

  if (minutes === null) {
    return null;
  }

  if (minutes === 0) {
    return <Badge color="gray">On time</Badge>;
  }

  return minutes > 0 ? (
    <Badge color="warning">+{minutes} min late</Badge>
  ) : (
    <Badge color="success">{-minutes} min early</Badge>
  );
}

function Duration({ minutes, emphasised = false }: { minutes: number | null; emphasised?: boolean }) {
  if (minutes === null || minutes < 0) {
    return (
      <span className="inline-flex items-center gap-1 font-semibold text-red-700 dark:text-red-400">
        <LuTriangleAlert className="size-3.5" aria-hidden={true} />
        Check times
      </span>
    );
  }

  return (
    <span
      className={twMerge(
        "font-mono tabular-nums",
        emphasised ? "font-bold text-gray-900 dark:text-white" : "text-gray-900 dark:text-gray-100",
      )}
    >
      {formatCompactDuration(minutes)}
    </span>
  );
}

function ScheduledDuration({ minutes }: { minutes: number }) {
  return (
    <span className="inline-flex items-center justify-end gap-1 font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
      <TimeCertaintyMark certainty="scheduled" />
      {formatCompactDuration(minutes)}
    </span>
  );
}

function useShiftLaterTimes(enabled: boolean) {
  const { values, setValues } = useFormikContext<FilledSchedule>();
  const previousOffBlock = useRef(asDate(values.offBlockTime));

  useEffect(() => {
    const before = previousOffBlock.current;
    const after = asDate(values.offBlockTime);
    previousOffBlock.current = after;

    if (!enabled || before === null || after === null || before.getTime() === after.getTime()) {
      return;
    }

    const delta = after.getTime() - before.getTime();
    const shifted = { ...values };

    for (const key of LATER_EVENTS) {
      const time = asDate(values[key]);
      if (time !== null) {
        shifted[key] = new Date(time.getTime() + delta);
      }
    }

    setValues(shifted, true);
  }, [enabled, setValues, values]);
}

type Props = {
  scheduled: FilledSchedule;
};

export function CheckInScheduleForm({ scheduled }: Props) {
  const { values } = useFormikContext<FilledSchedule>();
  const [shiftLaterTimes, setShiftLaterTimes] = useState(true);
  useShiftLaterTimes(shiftLaterTimes);

  const blockMinutes = minutesBetween(values.offBlockTime, values.onBlockTime);
  const segmentsAreValid = SEGMENTS.every(({ from, to }) => (minutesBetween(values[from], values[to]) ?? -1) >= 0);

  return (
    <div className="@container flex flex-col gap-5">
      <ToggleSwitch
        checked={shiftLaterTimes}
        color="indigo"
        sizing="sm"
        label="Move later times with off-block"
        onChange={setShiftLaterTimes}
      />
      <ol className="flex flex-col gap-4">
        {BLOCK_EVENTS.map(({ key, label }) => (
          <li
            key={key}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 [grid-template-areas:'event_deviation'_'input_input'] @md:grid-cols-[7rem_minmax(0,1fr)_7.5rem] @md:items-start @md:[grid-template-areas:'event_input_deviation']"
          >
            <div className="[grid-area:event] @md:pt-2">
              <span className="block text-sm font-semibold text-gray-900 dark:text-white">{label}</span>
              <span className="inline-flex items-center gap-1 text-xs tabular-nums text-gray-500 dark:text-gray-400">
                <TimeCertaintyMark certainty="scheduled" />
                <FormattedIcaoTime date={scheduled[key]} />
              </span>
            </div>
            <ManagedDateTimeInputBlock
              className="[grid-area:input]"
              field={key}
              label={`Estimated ${label.toLowerCase()} (UTC)`}
              autoComplete="off"
              required
            />
            <div className="justify-self-end [grid-area:deviation] @md:pt-3">
              <Deviation scheduled={scheduled[key]} estimated={values[key]} />
            </div>
          </li>
        ))}
      </ol>

      <dl className="rounded-xl bg-gray-50 px-4 py-3 text-sm dark:bg-gray-800/60">
        {SEGMENTS.map(({ label, from, to }) => (
          <div key={label} className="grid grid-cols-[minmax(0,1fr)_auto_5.5rem] items-baseline gap-x-4 py-1">
            <dt className="text-gray-600 dark:text-gray-300">{label}</dt>
            <dd className="text-end">
              <Duration minutes={minutesBetween(values[from], values[to])} />
            </dd>
            <dd className="text-end">
              <ScheduledDuration minutes={getTimeDifferenceInMinutes(scheduled[from], scheduled[to])} />
            </dd>
          </div>
        ))}
        <div className="mt-1 grid grid-cols-[minmax(0,1fr)_auto_5.5rem] items-baseline gap-x-4 border-t border-gray-300 pt-2 dark:border-gray-600">
          <dt className="font-semibold text-gray-900 dark:text-white">Block time</dt>
          <dd className="text-end">
            <Duration minutes={segmentsAreValid ? blockMinutes : null} emphasised />
          </dd>
          <dd className="text-end">
            <ScheduledDuration minutes={getTimeDifferenceInMinutes(scheduled.offBlockTime, scheduled.onBlockTime)} />
          </dd>
        </div>
      </dl>
    </div>
  );
}
