import { compartmentsOf, type DoorSide, type HoldVariant } from "~/features/cargo-hold/model";
import type { CargoUnitEntry, FlightCargoManifest } from "~/features/cargo-manifest/model";
import { continuesBeyond } from "~/features/cargo-manifest/model";

export type UnloadEntry = {
  unit: CargoUnitEntry;
  compartment: number | null;
  doorSide: DoorSide | null;
  tightestConnectionMinutes: number | null;
};

export type UnloadSequence = {
  order: UnloadEntry[];
  remainingAboard: UnloadEntry[];
  derivedFrom: string[];
  compartmentKnown: boolean;
};

export const UNLOAD_DERIVED_FROM = [
  "premium cabin baggage",
  "what each shipment is doing on this flight",
  "time to the onward connection",
  "whether the unit transfers intact",
  "the point the unit is built for",
];

function tightestConnection(unit: CargoUnitEntry): number | null {
  const minutes = unit.shipments
    .filter(continuesBeyond)
    .map((shipment) => shipment.connectionMinutes)
    .filter((value): value is number => value !== null);

  return minutes.length === 0 ? null : Math.min(...minutes);
}

function staysAboard(unit: CargoUnitEntry): boolean {
  return unit.sealed && unit.beyondDestination !== null;
}

function rank(entry: UnloadEntry): number {
  if (entry.unit.priority) {
    return 0;
  }
  return entry.tightestConnectionMinutes === null ? 2 : 1;
}

export function unloadSequence(manifest: FlightCargoManifest, variant: HoldVariant | null): UnloadSequence {
  const doors = new Map(
    variant === null ? [] : compartmentsOf(variant).map((compartment) => [compartment.number, compartment.doorSide]),
  );

  const entries: UnloadEntry[] = manifest.units.map((unit) => ({
    unit,
    compartment: unit.compartment,
    doorSide: unit.compartment === null ? null : (doors.get(unit.compartment) ?? null),
    tightestConnectionMinutes: tightestConnection(unit),
  }));

  const order = entries
    .filter((entry) => !staysAboard(entry.unit))
    .sort((a, b) => {
      const byRank = rank(a) - rank(b);
      if (byRank !== 0) {
        return byRank;
      }
      const aMinutes = a.tightestConnectionMinutes ?? Number.POSITIVE_INFINITY;
      const bMinutes = b.tightestConnectionMinutes ?? Number.POSITIVE_INFINITY;
      if (aMinutes !== bMinutes) {
        return aMinutes - bMinutes;
      }
      return (a.compartment ?? 0) - (b.compartment ?? 0);
    });

  return {
    order,
    remainingAboard: entries.filter((entry) => staysAboard(entry.unit)),
    derivedFrom: UNLOAD_DERIVED_FROM,
    compartmentKnown: variant !== null,
  };
}
