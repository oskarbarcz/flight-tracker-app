import React from "react";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import type { Terminal } from "~/features/terminal";

type Props = {
  terminal: Terminal;
};

export function AssignedTerminalPanel({ terminal }: Props) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/60 dark:border-amber-900 dark:bg-amber-950/40">
      <div className="flex items-center gap-2 border-b border-amber-200/70 px-3 py-2 dark:border-amber-900/70">
        <HiOutlineOfficeBuilding className="text-amber-500" size={14} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">
          Terminal
        </span>
        <span className="ms-auto font-mono text-xl font-bold text-gray-900 dark:text-white">{terminal.shortName}</span>
      </div>
      <dl className="grid grid-cols-1 gap-x-4 gap-y-1 px-3 py-2.5 text-xs lg:grid-cols-2">
        <div className="col-span-2">
          <Row label="Name" value={terminal.fullName} />
        </div>
        <Row label="Avg taxi" value={`${terminal.averageTaxiTime} min`} mono />
        {terminal.operatorCodes.length > 0 && <Row label="Operators" value={terminal.operatorCodes.join(", ")} mono />}
      </dl>
      {terminal.text && (
        <div className="border-t border-amber-200/70 px-3 py-2 text-xs text-gray-600 dark:border-amber-900/70 dark:text-gray-300">
          {terminal.text}
        </div>
      )}
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="text-gray-500 dark:text-gray-400">{label}:</dt>
      <dd className={`text-gray-800 dark:text-gray-100 ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}
