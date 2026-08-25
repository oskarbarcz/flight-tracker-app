import React from "react";
import type { CargoUnitEntry } from "~/features/cargo-manifest/model";
import { ContentClass, unitTotalKg } from "~/features/cargo-manifest/model";
import { toHuman } from "~/i18n/translate";
import { SpecRow } from "~/shared/ui/Display/SpecRow";

type Props = {
  units: CargoUnitEntry[];
  note: string | null;
};

export function PositionlessLoad({ units, note }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {note !== null && (
        <p className="rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {note}
        </p>
      )}

      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {units.map((unit, index) => (
          <li key={unit.uldCode ?? `lot-${index}`} className="py-3">
            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                    {unit.uldCode ?? toHuman.cargoManifest.unitKind(unit.kind)}
                  </span>
                  {unit.uldType !== null && (
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{unit.uldType}</span>
                  )}
                </div>
                <p className="mt-0.5 font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
                  {toHuman.cargoManifest.contentClass(unit.contentClass)}
                  {unit.contentClass === ContentClass.Baggage
                    ? ` · ${unit.bagCount ?? 0} bags`
                    : ` · ${unit.shipments.length} shipments`}
                </p>
                {unit.contentClass !== ContentClass.Baggage && unit.shipments.length > 0 && (
                  <ul className="mt-2 flex flex-col gap-1">
                    {unit.shipments.map((shipment) => (
                      <li key={shipment.awb} className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{shipment.awb}</span>{" "}
                        {shipment.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <dl className="grid h-fit grid-cols-[auto_auto] gap-x-3 gap-y-2 sm:pt-0.5">
                <SpecRow label="Contents" value={`${unit.grossKg.toLocaleString()} kg`} />
                <SpecRow label="Tare" value={`${unit.tareKg.toLocaleString()} kg`} />
                <SpecRow label="Total" value={`${unitTotalKg(unit).toLocaleString()} kg`} />
                <SpecRow label="Volume" value={`${unit.volumeM3} m³`} />
              </dl>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
