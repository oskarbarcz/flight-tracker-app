import React from "react";
import { LuArrowRight, LuCheck } from "react-icons/lu";
import type { FlatLoadsheetFormData } from "~/features/flight/form-types";
import type { CabinCapacity } from "~/features/flight/hooks/useCabinCapacity";
import { toHuman } from "~/i18n/translate";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Change = {
  label: string;
  before: number;
  after: number;
  unit: "count" | "tons";
};

const TON_FORMAT: Intl.NumberFormatOptions = { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false };

function formatValue(value: number, unit: Change["unit"]): string {
  return unit === "tons" ? value.toLocaleString(undefined, TON_FORMAT) : String(value);
}

function formatDelta({ before, after, unit }: Change): string {
  const delta = after - before;
  const sign = delta > 0 ? "+" : "−";
  const magnitude = formatValue(Math.abs(delta), unit);

  return unit === "tons" ? `${sign}${magnitude} t` : `${sign}${magnitude}`;
}

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function loadChanges(
  reference: FlatLoadsheetFormData,
  values: FlatLoadsheetFormData,
  capacity: CabinCapacity | null,
): Change[] {
  const counts: Change[] = [
    { label: "Pilots", before: reference.pilots, after: values.pilots, unit: "count" },
    { label: "Relief pilots", before: reference.reliefPilots, after: values.reliefPilots, unit: "count" },
    { label: "Cabin crew", before: reference.cabinCrew, after: values.cabinCrew, unit: "count" },
  ];

  const cabins = capacity?.cabins ?? [];
  const referenceHasSplit = cabins.some(({ cabin }) => {
    const planned = reference.passengersByCabin[cabin];
    return planned !== undefined && planned !== "";
  });
  const passengers: Change[] =
    cabins.length > 0 && referenceHasSplit
      ? cabins.map(({ cabin }) => ({
          label: `${toHuman.cabinLayout.cabinClass(cabin)} passengers`,
          before: toNumber(reference.passengersByCabin[cabin]),
          after: toNumber(values.passengersByCabin[cabin]),
          unit: "count",
        }))
      : [{ label: "Passengers", before: reference.passengers, after: values.passengers, unit: "count" }];

  const weights: Change[] = [
    { label: "Cargo", before: reference.cargo, after: values.cargo, unit: "tons" },
    { label: "Payload", before: reference.payload, after: values.payload, unit: "tons" },
    { label: "Zero-fuel weight", before: reference.zeroFuelWeight, after: values.zeroFuelWeight, unit: "tons" },
  ];

  return [...counts, ...passengers, ...weights]
    .map((change) => ({ ...change, before: toNumber(change.before), after: toNumber(change.after) }))
    .filter(({ before, after, unit }) =>
      unit === "tons" ? Math.abs(after - before) >= 0.005 : Math.round(after) !== Math.round(before),
    );
}

type Props = {
  reference: FlatLoadsheetFormData;
  values: FlatLoadsheetFormData;
  capacity: CabinCapacity | null;
};

export function LoadChangesSummary({ reference, values, capacity }: Props) {
  const changes = loadChanges(reference, values, capacity);

  if (changes.length === 0) {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:bg-gray-800/60 dark:text-gray-200">
        <LuCheck className="size-4 shrink-0 text-green-700 dark:text-green-400" aria-hidden={true} />
        Matches the preliminary loadsheet.
      </p>
    );
  }

  return (
    <div className="rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/60">
      <FieldLabel>Since the preliminary loadsheet</FieldLabel>
      <dl className="mt-2 flex flex-col gap-1.5 text-sm">
        {changes.map((change) => (
          <div key={change.label} className="grid grid-cols-[minmax(0,1fr)_auto_4.5rem] items-baseline gap-x-3">
            <dt className="min-w-0 truncate text-gray-700 dark:text-gray-200">{change.label}</dt>
            <dd className="font-mono tabular-nums text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                {formatValue(change.before, change.unit)}
                <LuArrowRight className="size-3" aria-hidden={true} />
                <span className="sr-only">to</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatValue(change.after, change.unit)}
                </span>
              </span>
            </dd>
            <dd className="text-end font-mono text-xs font-semibold tabular-nums text-gray-700 dark:text-gray-200">
              {formatDelta(change)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
