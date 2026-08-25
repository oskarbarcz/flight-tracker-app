import type { FlightCargoManifest } from "~/features/cargo-manifest/model";

export type Reconciliation = {
  contentsKg: number;
  tareKg: number;
  unitTotalKg: number;
  compartmentTotalKg: number;
  reportedKg: number;
  unitDiscrepancyKg: number;
  compartmentDiscrepancyKg: number;
  reconciles: boolean;
  hasCompartments: boolean;
};

const TOLERANCE_KG = 0.5;

export function reconcile(manifest: FlightCargoManifest): Reconciliation {
  const contentsKg = manifest.units.reduce((sum, unit) => sum + unit.grossKg, 0);
  const tareKg = manifest.units.reduce((sum, unit) => sum + unit.tareKg, 0);
  const compartmentTotalKg = manifest.compartmentLoad.reduce((sum, entry) => sum + entry.weightKg, 0);

  const unitTotalKg = contentsKg + tareKg;
  const unitDiscrepancyKg = unitTotalKg - manifest.cargoKg;
  const compartmentDiscrepancyKg = compartmentTotalKg - manifest.cargoKg;
  const hasCompartments = manifest.compartmentLoad.length > 0;

  return {
    contentsKg,
    tareKg,
    unitTotalKg,
    compartmentTotalKg,
    reportedKg: manifest.cargoKg,
    unitDiscrepancyKg,
    compartmentDiscrepancyKg,
    hasCompartments,
    reconciles:
      Math.abs(unitDiscrepancyKg) <= TOLERANCE_KG &&
      (!hasCompartments || Math.abs(compartmentDiscrepancyKg) <= TOLERANCE_KG),
  };
}
