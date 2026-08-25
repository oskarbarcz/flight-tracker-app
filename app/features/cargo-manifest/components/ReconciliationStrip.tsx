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
    reportedKg,
    unitDiscrepancyKg,
    baggageInUnitsKg,
    reportedBaggageKg,
    baggageDiscrepancyKg,
    hasBaggageUnits,
    compartmentTotalKg,
    compartmentAccountedKg,
    compartmentDiscrepancyKg,
    hasCompartments,
    reconciles,
  } = reconciliation;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <BuildUpLine label="Contents" value={contentsKg} unit="kg" format={kilograms} />
        <BuildUpLine label="Tare" value={tareKg} unit="kg" format={kilograms} addition />
        <BuildUpLine label="Accounted for" value={unitTotalKg} unit="kg" format={kilograms} subtotal />
        <BuildUpLine label="Cargo reported" value={reportedKg} unit="kg" format={kilograms} total />
      </div>

      {hasBaggageUnits && (
        <div className="flex flex-col">
          <BuildUpLine label="Baggage in units" value={baggageInUnitsKg} unit="kg" format={kilograms} />
          <BuildUpLine label="Baggage reported" value={reportedBaggageKg} unit="kg" format={kilograms} total />
        </div>
      )}

      {hasCompartments && (
        <div className="flex flex-col">
          <BuildUpLine label="Compartment loads" value={compartmentTotalKg} unit="kg" format={kilograms} />
          <BuildUpLine
            label="Units in a compartment"
            value={compartmentAccountedKg}
            unit="kg"
            format={kilograms}
            total
          />
        </div>
      )}

      {!reconciles && (
        <div className="flex flex-col gap-1 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          {Math.abs(unitDiscrepancyKg) > 0 && (
            <p>
              The cargo units account for {kilograms(unitTotalKg)} kg against {kilograms(reportedKg)} kg reported, a
              difference of {kilograms(Math.abs(unitDiscrepancyKg))} kg.
            </p>
          )}
          {hasBaggageUnits && Math.abs(baggageDiscrepancyKg) > 0 && (
            <p>
              The baggage units account for {kilograms(baggageInUnitsKg)} kg against {kilograms(reportedBaggageKg)} kg
              reported, a difference of {kilograms(Math.abs(baggageDiscrepancyKg))} kg.
            </p>
          )}
          {hasCompartments && Math.abs(compartmentDiscrepancyKg) > 0 && (
            <p>
              The compartment loads total {kilograms(compartmentTotalKg)} kg against {kilograms(compartmentAccountedKg)}{" "}
              kg in the units placed in them, a difference of {kilograms(Math.abs(compartmentDiscrepancyKg))} kg.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
