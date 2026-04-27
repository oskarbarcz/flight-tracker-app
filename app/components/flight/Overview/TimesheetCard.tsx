"use client";

import { Button } from "flowbite-react";
import React from "react";
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import type { Schedule } from "~/models";

type Props = {
  title: string;
  schedule: Schedule;
  onUpdate?: () => void;
};

export function TimesheetCard({ title, schedule, onUpdate }: Props) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold dark:text-white">{title}</h3>
        {onUpdate && (
          <Button onClick={onUpdate} color="gray" outline size="xs" className="flex cursor-pointer items-center">
            Update
          </Button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <Cell label="DEP DATE">
          {schedule.offBlockTime ? <FormattedIcaoDate date={schedule.offBlockTime} /> : <Empty />}
        </Cell>
        <Cell label="OFF">
          {schedule.offBlockTime ? <FormattedIcaoTime date={schedule.offBlockTime} /> : <Empty />}
        </Cell>
        <Cell label="OUT">{schedule.takeoffTime ? <FormattedIcaoTime date={schedule.takeoffTime} /> : <Empty />}</Cell>
        <Cell label="IN">{schedule.arrivalTime ? <FormattedIcaoTime date={schedule.arrivalTime} /> : <Empty />}</Cell>
        <Cell label="ON">{schedule.onBlockTime ? <FormattedIcaoTime date={schedule.onBlockTime} /> : <Empty />}</Cell>
      </div>
    </section>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="shrink-0 text-center">
      <span className="mb-1 block text-xs">{label}</span>
      <span className="block font-bold text-gray-900 dark:text-white">{children}</span>
    </div>
  );
}

function Empty() {
  return <span className="text-gray-400">—</span>;
}
