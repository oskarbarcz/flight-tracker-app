"use client";

import React from "react";
import { FaFileInvoice } from "react-icons/fa6";
import { HiExclamationTriangle, HiInformationCircle } from "react-icons/hi2";
import type { Loadsheet } from "~/models";

type Props = {
  title: string;
  loadsheet: Loadsheet | null;
  emptyMessage: string;
  emptySeverity?: "info" | "warning";
  badge?: string;
  footer?: React.ReactNode;
};

export function LoadsheetCard({ title, loadsheet, emptyMessage, emptySeverity = "info", badge, footer }: Props) {
  return (
    <section className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="h-1 bg-linear-to-r from-indigo-500 via-indigo-400 to-indigo-300 dark:from-indigo-600 dark:via-indigo-500 dark:to-indigo-400" />

      <div className="flex flex-1 flex-col gap-5 p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-indigo-500">
            <FaFileInvoice size={14} />
            <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
          </div>
          {badge && (
            <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-0.5 font-mono text-xs font-bold tracking-wider text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
              {badge}
            </span>
          )}
        </div>

        {loadsheet ? (
          <>
            <Section title="Souls on board">
              <StatBlock label="Pilots" value={loadsheet.flightCrew.pilots.toString()} />
              <StatBlock label="Relief Pilots" value={loadsheet.flightCrew.reliefPilots.toString()} />
              <StatBlock label="Cabin Crew" value={loadsheet.flightCrew.cabinCrew.toString()} />
              <StatBlock label="Passengers" value={loadsheet.passengers.toString()} />
            </Section>

            <Section title="Goods on board">
              <StatBlock label="Zero-fuel" value={loadsheet.zeroFuelWeight.toString()} unit="t" />
              <StatBlock label="Cargo" value={loadsheet.cargo.toString()} unit="t" />
              <StatBlock label="Payload" value={loadsheet.payload.toString()} unit="t" />
              <StatBlock label="Block Fuel" value={loadsheet.blockFuel.toString()} unit="t" />
            </Section>
          </>
        ) : (
          <EmptyState message={emptyMessage} severity={emptySeverity} />
        )}

        {footer && (
          <div className="mt-auto flex justify-end border-t border-gray-200 pt-3 dark:border-gray-800">{footer}</div>
        )}
      </div>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{title}</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{children}</div>
    </div>
  );
}

function StatBlock({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-center min-w-22 dark:border-gray-800 dark:bg-gray-950">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</span>
      <span className="mt-0.5 block font-mono text-base font-bold text-gray-800 dark:text-gray-100">
        {value}
        {unit && <span className="ms-0.5 text-xs font-normal">{unit}</span>}
      </span>
    </div>
  );
}

function EmptyState({ message, severity }: { message: string; severity: "info" | "warning" }) {
  if (severity === "warning") {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        <HiExclamationTriangle className="size-5 shrink-0 text-amber-500" />
        <span>{message}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50/40 px-4 py-5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
      <HiInformationCircle className="size-5 shrink-0 text-gray-400" />
      <span>{message}</span>
    </div>
  );
}
