import { Badge } from "flowbite-react";
import React from "react";
import { CompartmentLoading, type HoldCompartment } from "~/features/cargo-hold/model";
import { toHuman } from "~/i18n/translate";
import { SpecRow } from "~/shared/ui/Display/SpecRow";

type Props = {
  compartments: HoldCompartment[];
};

function perPositionLimit(compartment: HoldCompartment): string | null {
  if (compartment.positions.length === 0) {
    return null;
  }

  const limits = new Set(compartment.positions.map((position) => position.maxWeightKg));
  return limits.size === 1
    ? `${[...limits][0].toLocaleString()} kg`
    : `${Math.min(...limits).toLocaleString()}–${Math.max(...limits).toLocaleString()} kg`;
}

function summaryOf(compartment: HoldCompartment): string {
  const loading = toHuman.cargoHold.compartmentLoading(compartment.loading).toLowerCase();
  return compartment.loading === CompartmentLoading.Loose
    ? `${loading} · no positions`
    : `${loading} · ${compartment.positions.length} positions`;
}

export function CompartmentCapabilities({ compartments }: Props) {
  if (compartments.length === 0) {
    return (
      <p className="rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        This deck reports no compartments.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-800">
      {compartments.map((compartment) => (
        <li key={compartment.number} className="py-3">
          <div className="grid gap-x-6 gap-y-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-mono text-xs font-bold text-gray-500 dark:text-gray-400">
                  {compartment.number}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {toHuman.cargoHold.compartmentName(compartment.name)}
                </span>
              </div>

              <p className="mt-0.5 font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
                {summaryOf(compartment)}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge color={compartment.heated ? "success" : "gray"}>
                  {compartment.heated ? "Heated" : "Not heated"}
                </Badge>
                <Badge color={compartment.ventilated ? "success" : "gray"}>
                  {compartment.ventilated ? "Ventilated" : "Not ventilated"}
                </Badge>
                <Badge color="info">{toHuman.cargoHold.doorSide(compartment.doorSide)}</Badge>
              </div>
            </div>

            <dl className="grid h-fit grid-cols-[auto_auto] gap-x-3 gap-y-2 sm:pt-0.5">
              <SpecRow label="Compartment limit" value={`${compartment.maxWeightKg.toLocaleString()} kg`} />
              {perPositionLimit(compartment) !== null && (
                <SpecRow label="Per position" value={perPositionLimit(compartment)} />
              )}
              <SpecRow label="Usable volume" value={`${compartment.volumeM3} m³`} />
            </dl>
          </div>
        </li>
      ))}
    </ul>
  );
}
