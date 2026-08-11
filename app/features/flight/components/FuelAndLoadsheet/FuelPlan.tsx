import React from "react";
import { HiInformationCircle } from "react-icons/hi2";
import type { FuelBreakdown } from "~/features/flight";
import { BuildUpLine, BuildUpSplitLine, formatTons } from "~/features/flight/components/FuelAndLoadsheet/BuildUpLine";

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
  const shownAdditions = additions.filter((entry): entry is [string, number] => Boolean(entry[1]));
  const contingencyNote =
    typeof fuel.contingencyType === "string" ? shortenContingencyRule(fuel.contingencyType) : undefined;
  const planAlternate = fuel.block - fuel.taxi - fuel.trip - fuel.alternate;

  const enRoute = (
    <Section title="En-route & reserves">
      <BuildUpLine label="Taxi" value={fuel.taxi} />
      <BuildUpLine label="Trip" value={fuel.trip} />
      <BuildUpLine label="Contingency" value={fuel.contingencyAmount} note={contingencyNote} />
      <BuildUpLine label="Alternate" value={fuel.alternate} />
      <BuildUpLine label="Final reserve" value={fuel.reserve} />
    </Section>
  );

  const additional =
    shownAdditions.length > 0 ? (
      <Section title="Additional fuel">
        {shownAdditions.map(([label, value]) => (
          <BuildUpLine key={label} label={label} value={value} addition />
        ))}
      </Section>
    ) : null;

  const takeoffEntries = [
    { caption: "minimal", value: fuel.minTakeoff },
    { caption: "planned", value: fuel.planTakeoff },
  ].filter((entry): entry is { caption: string; value: number } => typeof entry.value === "number");

  const totals = (
    <div>
      {takeoffEntries.length > 0 && <BuildUpSplitLine label="Takeoff fuel" entries={takeoffEntries} />}
      <BuildUpLine label="Block fuel" value={fuel.block} total />
      {typeof fuel.planLanding === "number" && (
        <BuildUpLine label="Planned fuel at destination" value={fuel.planLanding} />
      )}
      {fuel.alternate > 0 && <BuildUpLine label="Planned fuel at alternate" value={planAlternate} />}
    </div>
  );

  const gauge =
    typeof fuel.maxTanks === "number" && fuel.maxTanks > 0 ? (
      <TankGauge block={fuel.block} capacity={fuel.maxTanks} />
    ) : null;

  return (
    <div className="flex flex-col gap-3">
      {enRoute}
      {additional}
      {totals}
      {gauge}
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

function TankGauge({ block, capacity }: { block: number; capacity: number }) {
  const percent = Math.min(100, Math.round((block / capacity) * 100));
  return (
    <div className="mt-1">
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-1 text-[10px] font-medium text-gray-500 dark:text-gray-400">
        {percent}% · {formatTons(block)} of {formatTons(capacity)} t tanks
      </div>
    </div>
  );
}
