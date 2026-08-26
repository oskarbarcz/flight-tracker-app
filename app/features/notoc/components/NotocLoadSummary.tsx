import React from "react";
import type { NotocLoadSummary as LoadSummary } from "~/features/notoc/model";
import { toHuman } from "~/i18n/translate";
import { DataField } from "~/shared/ui/Display/DataField";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Props = {
  summary: LoadSummary;
};

function kilograms(value: number): string {
  return `${value.toLocaleString()} kg`;
}

export function NotocLoadSummary({ summary }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        <DataField label="Cargo" value={kilograms(summary.cargoKg)} mono />
        <DataField label="Baggage" value={kilograms(summary.baggageKg)} mono />
      </div>

      <div className="grid grid-cols-3 gap-x-6 gap-y-2">
        <DataField label="Containers" value={String(summary.containerCount)} mono />
        <DataField label="Pallets" value={String(summary.palletCount)} mono />
        <DataField label="Loose lots" value={String(summary.looseLotCount)} mono />
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>By compartment</FieldLabel>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
          {summary.compartments.map((compartment) => (
            <DataField
              key={`${compartment.deck}-${compartment.compartment}`}
              label={`${toHuman.cargoHold.deck(compartment.deck)} ${compartment.compartment}`}
              value={
                compartment.dryIceKg > 0
                  ? `${kilograms(compartment.weightKg)} · dry ice ${kilograms(compartment.dryIceKg)}`
                  : kilograms(compartment.weightKg)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
