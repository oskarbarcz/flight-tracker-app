import React from "react";
import { HiInformationCircle } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";
import type { FuelBreakdown } from "~/features/flight";

function formatTons(value: number): string {
  return value.toFixed(1);
}

function shortenContingencyRule(rule: string): string {
  return rule.split(" of ")[0].trim();
}

export function FuelPlan({ fuel }: { fuel: FuelBreakdown | null }) {
  if (!fuel) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50/40 px-4 py-5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
        <HiInformationCircle className="size-5 shrink-0 text-gray-400" />
        <span>Fuel figures are not available for this loadsheet.</span>
      </div>
    );
  }

  const additions: [string, number | undefined][] = [
    ["Extra", fuel.extra],
    ["MEL", fuel.mel],
    ["ATC", fuel.atc],
    ["Weather", fuel.wxx],
    ["ETOPS", fuel.etops],
    ["Tankering", fuel.tankering],
  ];
  const shownAdditions = additions.filter((entry): entry is [string, number] => typeof entry[1] === "number");
  const contingencyNote =
    typeof fuel.contingencyType === "string" ? shortenContingencyRule(fuel.contingencyType) : undefined;

  return (
    <div className="flex flex-col gap-4">
      <Section title="En-route & reserves">
        <Line label="Taxi" value={fuel.taxi} />
        <Line label="Trip" value={fuel.trip} />
        <Line label="Contingency" value={fuel.contingencyAmount} note={contingencyNote} />
        <Line label="Alternate" value={fuel.alternate} />
        <Line label="Final reserve" value={fuel.reserve} />
        {typeof fuel.minTakeoff === "number" && <Line label="Min takeoff" value={fuel.minTakeoff} subtotal />}
      </Section>

      <Section title="Additional fuel">
        {shownAdditions.map(([label, value]) => (
          <Line key={label} label={label} value={value} addition />
        ))}
      </Section>

      <div>
        {typeof fuel.planTakeoff === "number" && <Line label="Planned takeoff" value={fuel.planTakeoff} subtotal />}
        <Line label="Block fuel" value={fuel.block} total />
        {typeof fuel.planLanding === "number" && <Line label="Planned fuel at destination" value={fuel.planLanding} />}
        {typeof fuel.averageFuelFlow === "number" && (
          <Line label="Average fuel flow" value={fuel.averageFuelFlow} unit="t/h" />
        )}
        {typeof fuel.maxTanks === "number" && <Line label="Max tank capacity" value={fuel.maxTanks} />}
      </div>

      {typeof fuel.maxTanks === "number" && fuel.maxTanks > 0 && (
        <TankGauge block={fuel.block} capacity={fuel.maxTanks} />
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{title}</h3>
      {children}
    </div>
  );
}

function Line({
  label,
  value,
  note,
  unit = "t",
  subtotal,
  total,
  addition,
}: {
  label: string;
  value: number;
  note?: string;
  unit?: string;
  subtotal?: boolean;
  total?: boolean;
  addition?: boolean;
}) {
  return (
    <div
      className={twMerge(
        "flex items-baseline justify-between gap-2 py-1.5",
        subtotal && "mt-1 border-t border-gray-200 pt-2 dark:border-gray-800",
        total && "mt-1 border-t-2 border-gray-300 pt-2 dark:border-gray-700",
      )}
    >
      <span
        className={twMerge(
          "flex items-baseline gap-1.5 text-xs text-gray-500 dark:text-gray-400",
          addition && "text-gray-500 dark:text-gray-400",
          (subtotal || total) && "font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300",
        )}
      >
        {addition && <span>+</span>}
        {label}
        {note && (
          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-semibold normal-case tracking-normal text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            {note}
          </span>
        )}
      </span>
      <span
        className={twMerge(
          "font-mono tabular-nums text-sm text-gray-700 dark:text-gray-300",
          addition && "text-gray-500 dark:text-gray-400",
          subtotal && "font-bold text-gray-800 dark:text-gray-100",
          total && "text-lg font-bold text-gray-900 dark:text-white",
        )}
      >
        {formatTons(value)}
        <span className="ms-0.5 text-[10px] font-normal opacity-60">{unit}</span>
      </span>
    </div>
  );
}

function TankGauge({ block, capacity }: { block: number; capacity: number }) {
  const percent = Math.min(100, Math.round((block / capacity) * 100));
  return (
    <div className="mt-3">
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-1 text-[10px] font-medium text-gray-500 dark:text-gray-400">
        {percent}% · {formatTons(block)} of {formatTons(capacity)} t tanks
      </div>
    </div>
  );
}
