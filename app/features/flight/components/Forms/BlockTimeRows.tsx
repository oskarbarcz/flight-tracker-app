import { Badge } from "flowbite-react";
import { useFormikContext } from "formik";
import React from "react";
import { TimeCertaintyMark } from "~/features/flight/components/Dashboard/Tracking/TimeCertaintyMark";
import { BLOCK_EVENTS, type BlockEventKey } from "~/features/flight/lib/blockEvents";
import type { FilledSchedule } from "~/features/flight/model";
import { getTimeDifferenceInMinutes } from "~/shared/lib/time";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { ManagedDateTimeInputBlock } from "~/shared/ui/Form/Managed/ManagedDateTimeInputBlock";

export function asDate(value: unknown): Date | null {
  return value instanceof Date && !Number.isNaN(value.getTime()) ? value : null;
}

export function minutesBetween(from: unknown, to: unknown): number | null {
  const start = asDate(from);
  const end = asDate(to);

  return start === null || end === null ? null : getTimeDifferenceInMinutes(start, end);
}

function Deviation({ scheduled, entered }: { scheduled: Date; entered: unknown }) {
  const minutes = minutesBetween(scheduled, entered);

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

type Props = {
  scheduled: FilledSchedule;
  kind: "Estimated" | "Predicted";
  events?: BlockEventKey[];
};

export function BlockTimeRows({ scheduled, kind, events }: Props) {
  const { values } = useFormikContext<FilledSchedule>();
  const shown = events === undefined ? BLOCK_EVENTS : BLOCK_EVENTS.filter(({ key }) => events.includes(key));

  return (
    <ol className="flex flex-col gap-4">
      {shown.map(({ key, label }) => (
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
            label={`${kind} ${label.toLowerCase()} (UTC)`}
            autoComplete="off"
            required
          />
          <div className="justify-self-end [grid-area:deviation] @md:pt-3">
            <Deviation scheduled={scheduled[key]} entered={values[key]} />
          </div>
        </li>
      ))}
    </ol>
  );
}
