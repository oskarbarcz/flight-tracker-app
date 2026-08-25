import { Badge } from "flowbite-react";
import React from "react";
import { twMerge } from "tailwind-merge";
import { compartmentsOf, type HoldCompartment, type HoldVariant } from "~/features/cargo-hold/model";
import type { CompartmentLoad, FlightCargoManifest } from "~/features/cargo-manifest/model";
import { toHuman } from "~/i18n/translate";
import { SpecRow } from "~/shared/ui/Display/SpecRow";

type Props = {
  manifest: FlightCargoManifest;
  variant: HoldVariant | null;
};

function percent(load: number, limit: number | undefined): number | null {
  if (limit === undefined || limit === 0) {
    return null;
  }
  return Math.round((load / limit) * 100);
}

function Gauge({ label, used, limit, unit }: { label: string; used: number; limit: number | undefined; unit: string }) {
  const share = percent(used, limit);
  const over = share !== null && share > 100;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</span>
        <span className="font-mono text-xs tabular-nums text-gray-600 dark:text-gray-300">
          {used.toLocaleString()}
          {limit !== undefined && ` of ${limit.toLocaleString()}`} {unit}
          {share !== null && (
            <span
              className={twMerge(
                "ms-2 font-bold",
                over ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400",
              )}
            >
              {share}%{over && " — over limit"}
            </span>
          )}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={twMerge("h-full rounded-full", over ? "bg-red-500" : "bg-gray-500 dark:bg-gray-400")}
          style={{ width: `${Math.min(share ?? 0, 100)}%` }}
        />
      </div>
    </div>
  );
}

export function CompartmentLoadList({ manifest, variant }: Props) {
  if (manifest.compartmentLoad.length === 0) {
    return (
      <p className="rounded-lg bg-gray-50 px-3 py-2.5 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
        This load is reported without compartments.
      </p>
    );
  }

  const configured = new Map<number, HoldCompartment>(
    variant === null ? [] : compartmentsOf(variant).map((compartment) => [compartment.number, compartment]),
  );

  const volumeIn = (compartment: number) =>
    manifest.units.filter((unit) => unit.compartment === compartment).reduce((sum, unit) => sum + unit.volumeM3, 0);

  const share = (entry: CompartmentLoad) => Math.round((entry.weightKg / manifest.cargoKg) * 100);

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-800">
      {manifest.compartmentLoad.map((entry) => {
        const compartment = configured.get(entry.compartment);
        const volume = volumeIn(entry.compartment);

        return (
          <li key={`${entry.deck}-${entry.compartment}`} className="py-3">
            <div className="grid gap-x-8 gap-y-3 sm:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-mono text-xs font-bold text-gray-500 dark:text-gray-400">
                    {entry.compartment}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {compartment === undefined
                      ? toHuman.cargoHold.deck(entry.deck)
                      : toHuman.cargoHold.compartmentName(compartment.name)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{toHuman.cargoHold.deck(entry.deck)}</span>
                </div>

                <p className="mt-0.5 font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
                  {share(entry)}% of the cargo aboard
                </p>

                {entry.dryIceKg > 0 && (
                  <div className="mt-2">
                    <Badge color="warning">Dry ice {entry.dryIceKg.toLocaleString()} kg</Badge>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                <Gauge label="Weight" used={entry.weightKg} limit={compartment?.maxWeightKg} unit="kg" />
                <Gauge label="Volume" used={Math.round(volume * 10) / 10} limit={compartment?.volumeM3} unit="m³" />
                {compartment !== undefined && (
                  <dl className="grid w-fit grid-cols-[auto_auto] gap-x-3 gap-y-1">
                    <SpecRow label="Door" value={toHuman.cargoHold.doorSide(compartment.doorSide)} />
                  </dl>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
