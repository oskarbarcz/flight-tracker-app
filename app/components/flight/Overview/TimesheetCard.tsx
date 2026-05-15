"use client";

import React from "react";
import { FaClock } from "react-icons/fa6";
import { HiInformationCircle } from "react-icons/hi";
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import { Container } from "~/components/shared/Layout/Container";
import { ContainerTitle } from "~/components/shared/Layout/ContainerTitle";
import type { Schedule } from "~/models";

type Props = {
  title: string;
  subtitle?: string;
  schedule?: Schedule;
  emptyMessage: string;
  badge?: string;
  footer?: React.ReactNode;
};

export function TimesheetCard({ title, subtitle, schedule, emptyMessage, badge, footer }: Props) {
  return (
    <Container>
      <ContainerTitle
        icon={FaClock}
        title={title}
        description={subtitle}
        actions={
          badge && (
            <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 font-mono text-xs font-bold tracking-wider text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
              {badge}
            </span>
          )
        }
      />

      {schedule ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <StatBlock label="DEP DATE">
            {schedule.offBlockTime ? <FormattedIcaoDate date={schedule.offBlockTime} /> : <Empty />}
          </StatBlock>
          <StatBlock label="OFF">
            {schedule.offBlockTime ? <FormattedIcaoTime date={schedule.offBlockTime} /> : <Empty />}
          </StatBlock>
          <StatBlock label="OUT">
            {schedule.takeoffTime ? <FormattedIcaoTime date={schedule.takeoffTime} /> : <Empty />}
          </StatBlock>
          <StatBlock label="IN">
            {schedule.arrivalTime ? <FormattedIcaoTime date={schedule.arrivalTime} /> : <Empty />}
          </StatBlock>
          <StatBlock label="ON">
            {schedule.onBlockTime ? <FormattedIcaoTime date={schedule.onBlockTime} /> : <Empty />}
          </StatBlock>
        </div>
      ) : (
        <EmptyState message={emptyMessage} />
      )}

      {footer && (
        <div className="mt-auto flex justify-end border-t border-gray-200 pt-3 dark:border-gray-800">{footer}</div>
      )}
    </Container>
  );
}

function StatBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-center min-w-22 dark:border-gray-800 dark:bg-gray-950">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</span>
      <span className="mt-0.5 block font-mono text-base font-bold text-gray-800 dark:text-gray-100">{children}</span>
    </div>
  );
}

function Empty() {
  return <span className="text-gray-400">—</span>;
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50/40 px-4 py-5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
      <HiInformationCircle className="size-5 shrink-0 text-gray-400" />
      <span>{message}</span>
    </div>
  );
}
