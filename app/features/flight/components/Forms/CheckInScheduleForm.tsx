import { ToggleSwitch } from "flowbite-react";
import { useFormikContext } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { LuTriangleAlert } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import { TimeCertaintyMark } from "~/features/flight/components/Dashboard/Tracking/TimeCertaintyMark";
import { asDate, BlockTimeRows, minutesBetween } from "~/features/flight/components/Forms/BlockTimeRows";
import type { BlockEventKey } from "~/features/flight/lib/blockEvents";
import type { FilledSchedule } from "~/features/flight/model";
import { formatCompactDuration, getTimeDifferenceInMinutes } from "~/shared/lib/time";

const LATER_EVENTS: BlockEventKey[] = ["takeoffTime", "arrivalTime", "onBlockTime"];

const SEGMENTS: { label: string; from: BlockEventKey; to: BlockEventKey }[] = [
  { label: "Taxi out", from: "offBlockTime", to: "takeoffTime" },
  { label: "Air time", from: "takeoffTime", to: "arrivalTime" },
  { label: "Taxi in", from: "arrivalTime", to: "onBlockTime" },
];

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
      <BlockTimeRows scheduled={scheduled} kind="Estimated" />

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
