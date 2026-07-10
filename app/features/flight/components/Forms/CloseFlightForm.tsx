import { useFormikContext } from "formik";
import React from "react";
import type { FlatCloseFlightFormData } from "~/features/flight/form-types";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";

function formatTons(value: number): string {
  return `${Number(value.toFixed(3))} t`;
}

function formatSignedTons(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${Number(value.toFixed(3))} t`;
}

export function CloseFlightForm({ plannedTrip }: { plannedTrip: number | null }) {
  const { values } = useFormikContext<FlatCloseFlightFormData>();

  const actual = values.actualFuelBurned === "" ? null : Number(values.actualFuelBurned);
  const hasActual = actual !== null && Number.isFinite(actual);
  const delta = plannedTrip !== null && hasActual ? actual - plannedTrip : null;

  const deltaTone =
    delta === null || delta === 0
      ? "text-gray-600 dark:text-gray-300"
      : delta > 0
        ? "text-amber-600 dark:text-amber-400"
        : "text-emerald-600 dark:text-emerald-400";

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Record the actual fuel burned during the flight. This closes the flight and cannot be undone.
      </p>

      <ManagedFloatingInputBlock
        field="actualFuelBurned"
        label="Actual fuel burned"
        type="number"
        autoComplete="off"
        unit="t"
      />

      {plannedTrip !== null && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Planned vs actual
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Planned trip fuel</dt>
              <dd className="font-medium tabular-nums text-gray-800 dark:text-gray-100">{formatTons(plannedTrip)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-gray-500 dark:text-gray-400">Actual fuel burned</dt>
              <dd className="font-medium tabular-nums text-gray-800 dark:text-gray-100">
                {hasActual ? formatTons(actual) : "—"}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
              <dt className="text-gray-500 dark:text-gray-400">Difference</dt>
              <dd className={`font-semibold tabular-nums ${deltaTone}`}>
                {delta === null ? "—" : formatSignedTons(delta)}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
