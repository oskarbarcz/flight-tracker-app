import type { CargoUnitEntry, FlightCargoManifest } from "~/features/cargo-manifest/model";
import { ContentClass, unitTotalKg } from "~/features/cargo-manifest/model";

export type Reconciliation = {
  contentsKg: number;
  tareKg: number;
  unitTotalKg: number;
  reportedKg: number;
  unitDiscrepancyKg: number;
  baggageInUnitsKg: number;
  reportedBaggageKg: number;
  baggageDiscrepancyKg: number;
  hasBaggageUnits: boolean;
  compartmentTotalKg: number;
  compartmentAccountedKg: number;
  compartmentDiscrepancyKg: number;
  hasCompartments: boolean;
  reconciles: boolean;
};

const TOLERANCE_KG = 0.5;

function isBaggage(unit: CargoUnitEntry): boolean {
  return unit.contentClass === ContentClass.Baggage;
}

function within(discrepancy: number): boolean {
  return Math.abs(discrepancy) <= TOLERANCE_KG;
}

export function reconcile(manifest: FlightCargoManifest): Reconciliation {
  const cargoUnits = manifest.units.filter((unit) => !isBaggage(unit));
  const baggageUnits = manifest.units.filter(isBaggage);

  const contentsKg = cargoUnits.reduce((sum, unit) => sum + unit.grossKg, 0);
  const tareKg = cargoUnits.reduce((sum, unit) => sum + unit.tareKg, 0);
  const total = contentsKg + tareKg;

  const baggageInUnitsKg = baggageUnits.reduce((sum, unit) => sum + unitTotalKg(unit), 0);
  const compartmentTotalKg = manifest.compartmentLoad.reduce((sum, entry) => sum + entry.weightKg, 0);
  const compartmentAccountedKg = manifest.units
    .filter((unit) => unit.compartment !== null)
    .reduce((sum, unit) => sum + unitTotalKg(unit), 0);

  const unitDiscrepancyKg = total - manifest.cargoKg;
  const baggageDiscrepancyKg = baggageInUnitsKg - manifest.baggageKg;
  const compartmentDiscrepancyKg = compartmentTotalKg - compartmentAccountedKg;

  const hasBaggageUnits = baggageUnits.length > 0;
  const hasCompartments = manifest.compartmentLoad.length > 0;

  return {
    contentsKg,
    tareKg,
    unitTotalKg: total,
    reportedKg: manifest.cargoKg,
    unitDiscrepancyKg,
    baggageInUnitsKg,
    reportedBaggageKg: manifest.baggageKg,
    baggageDiscrepancyKg,
    hasBaggageUnits,
    compartmentTotalKg,
    compartmentAccountedKg,
    compartmentDiscrepancyKg,
    hasCompartments,
    reconciles:
      within(unitDiscrepancyKg) &&
      (!hasBaggageUnits || within(baggageDiscrepancyKg)) &&
      (!hasCompartments || within(compartmentDiscrepancyKg)),
  };
}
