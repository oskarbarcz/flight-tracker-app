import React from "react";
import type { Reconciliation } from "~/features/cargo-manifest/lib/reconciliation";
import { BuildUpLine } from "~/features/flight/components/FuelAndLoadsheet/BuildUpLine";

type Props = {
  reconciliation: Reconciliation;
};

function kilograms(value: number): string {
  return value.toLocaleString();
}

export function ReconciliationStrip({ reconciliation }: Props) {
  const {
    contentsKg,
    tareKg,
    unitTotalKg,
    compartmentTotalKg,
    reportedKg,
    unitDiscrepancyKg,
    hasCompartments,
    reconciles,
  } = reconciliation;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <BuildUpLine label="Contents" value={contentsKg} unit="kg" format={kilograms} />
        <BuildUpLine label="Tare" value={tareKg} unit="kg" format={kilograms} addition />
        <BuildUpLine label="Accounted for" value={unitTotalKg} unit="kg" format={kilograms} subtotal />
        {hasCompartments && (
          <BuildUpLine label="Compartment loads" value={compartmentTotalKg} unit="kg" format={kilograms} />
        )}
        <BuildUpLine label="Cargo reported" value={reportedKg} unit="kg" format={kilograms} total />
      </div>

      {!reconciles && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          The units account for {kilograms(unitTotalKg)} kg against {kilograms(reportedKg)} kg reported, a difference of{" "}
          {kilograms(Math.abs(unitDiscrepancyKg))} kg.
        </p>
      )}
    </div>
  );
}
