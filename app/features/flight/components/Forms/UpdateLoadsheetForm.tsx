import { useFormikContext } from "formik";
import React from "react";
import type { FuelBreakdown } from "~/features/flight";
import { FuelPlan } from "~/features/flight/components/FuelAndLoadsheet/FuelPlan";
import type { FlatLoadsheetFormData } from "~/features/flight/form-types";
import { ManagedFloatingInputBlock } from "~/shared/ui/Form/Managed/ManagedFloatingInputBlock";

function toNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function UpdateLoadsheetForm() {
  const { values } = useFormikContext<FlatLoadsheetFormData>();

  const blockFuel = toNumber(values.blockFuel);
  const trip = toNumber(values.trip);
  const taxi = toNumber(values.taxi);
  const alternate = toNumber(values.alternate);
  const reserve = toNumber(values.reserve);
  const contingencyAmount = toNumber(values.contingencyAmount);
  const mel = toNumber(values.mel);
  const atc = toNumber(values.atc);
  const wxx = toNumber(values.wxx);
  const extra = toNumber(values.extra);
  const etops = toNumber(values.etops);
  const tankering = toNumber(values.tankering);
  const averageFuelFlow = toNumber(values.averageFuelFlow);
  const maxTanks = toNumber(values.maxTanks);

  const preview: FuelBreakdown = {
    block: blockFuel,
    taxi,
    trip,
    alternate,
    reserve,
    contingencyType: values.contingencyType?.trim() ? values.contingencyType.trim() : null,
    contingencyAmount,
    mel,
    atc,
    wxx,
    extra,
    tankering,
    etops,
    minTakeoff: trip + contingencyAmount + alternate + reserve + mel + atc + wxx + etops,
    planTakeoff: blockFuel - taxi,
    planLanding: blockFuel - taxi - trip,
    averageFuelFlow,
    maxTanks,
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6">
        <Group title="Souls on board">
          <ManagedFloatingInputBlock field="pilots" label="Pilots" type="number" autoComplete="off" />
          <ManagedFloatingInputBlock field="reliefPilots" label="Relief pilots" type="number" autoComplete="off" />
          <ManagedFloatingInputBlock field="cabinCrew" label="Cabin crew" type="number" autoComplete="off" />
          <ManagedFloatingInputBlock field="passengers" label="Passengers" type="number" autoComplete="off" />
        </Group>

        <Group title="Load" columns={2}>
          <ManagedFloatingInputBlock field="cargo" label="Cargo" type="number" autoComplete="off" unit="t" />
          <ManagedFloatingInputBlock field="payload" label="Payload" type="number" autoComplete="off" unit="t" />
          <ManagedFloatingInputBlock
            field="zeroFuelWeight"
            label="Zero-fuel weight"
            type="number"
            autoComplete="off"
            unit="t"
          />
          <ManagedFloatingInputBlock field="blockFuel" label="Block fuel" type="number" autoComplete="off" unit="t" />
        </Group>
      </div>

      <div className="space-y-6">
        <Group title="Fuel plan" columns={2}>
          <ManagedFloatingInputBlock field="trip" label="Trip" type="number" autoComplete="off" unit="t" />
          <ManagedFloatingInputBlock
            field="contingencyAmount"
            label="Contingency"
            type="number"
            autoComplete="off"
            unit="t"
          />
          <ManagedFloatingInputBlock
            field="contingencyType"
            label="Contingency rule"
            type="text"
            autoComplete="off"
            required={false}
          />
          <ManagedFloatingInputBlock field="alternate" label="Alternate" type="number" autoComplete="off" unit="t" />
          <ManagedFloatingInputBlock field="reserve" label="Final reserve" type="number" autoComplete="off" unit="t" />
          <ManagedFloatingInputBlock field="taxi" label="Taxi" type="number" autoComplete="off" unit="t" />
        </Group>

        <Group title="Additional fuel" columns={2}>
          <ManagedFloatingInputBlock field="extra" label="Extra" type="number" autoComplete="off" unit="t" />
          <ManagedFloatingInputBlock field="mel" label="MEL" type="number" autoComplete="off" unit="t" />
          <ManagedFloatingInputBlock field="atc" label="ATC" type="number" autoComplete="off" unit="t" />
          <ManagedFloatingInputBlock field="wxx" label="Weather" type="number" autoComplete="off" unit="t" />
          <ManagedFloatingInputBlock
            field="etops"
            label="ETOPS"
            type="number"
            autoComplete="off"
            required={false}
            unit="t"
          />
          <ManagedFloatingInputBlock field="tankering" label="Tankering" type="number" autoComplete="off" unit="t" />
        </Group>

        <Group title="Performance" columns={2}>
          <ManagedFloatingInputBlock
            field="averageFuelFlow"
            label="Average fuel flow"
            type="number"
            autoComplete="off"
            required={false}
            unit="t/h"
          />
          <ManagedFloatingInputBlock
            field="maxTanks"
            label="Max tank capacity"
            type="number"
            autoComplete="off"
            required={false}
            unit="t"
          />
        </Group>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Fuel build-up
          </h3>
          <FuelPlan fuel={preview} />
        </div>
      </div>
    </div>
  );
}

function Group({ title, columns = 1, children }: { title: string; columns?: number; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{title}</h3>
      <div className={columns === 2 ? "grid grid-cols-1 gap-4 sm:grid-cols-2" : "grid grid-cols-1 gap-4"}>
        {children}
      </div>
    </div>
  );
}
