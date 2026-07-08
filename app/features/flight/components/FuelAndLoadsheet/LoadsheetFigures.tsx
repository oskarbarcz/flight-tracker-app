import React from "react";
import type { Loadsheet } from "~/features/flight";

export function LoadsheetFigures({ loadsheet }: { loadsheet: Loadsheet }) {
  return (
    <>
      <Section title="Souls on board">
        <StatBlock label="Pilots" value={loadsheet.flightCrew.pilots.toString()} />
        <StatBlock label="Relief Pilots" value={loadsheet.flightCrew.reliefPilots.toString()} />
        <StatBlock label="Cabin Crew" value={loadsheet.flightCrew.cabinCrew.toString()} />
        <StatBlock label="Passengers" value={loadsheet.passengers.toString()} />
      </Section>

      <Section title="Goods on board">
        <StatBlock label="Zero-fuel weight" value={loadsheet.zeroFuelWeight.toString()} unit="t" />
        <StatBlock label="Cargo" value={loadsheet.cargo.toString()} unit="t" />
        <StatBlock label="Payload" value={loadsheet.payload.toString()} unit="t" />
        <StatBlock label="Block Fuel" value={loadsheet.blockFuel.toString()} unit="t" />
      </Section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{title}</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{children}</div>
    </div>
  );
}

function StatBlock({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-center min-w-22 dark:border-gray-800 dark:bg-gray-950">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</span>
      <span className="mt-0.5 block font-mono text-base font-bold text-gray-800 dark:text-gray-100">
        {value}
        {unit && <span className="ms-0.5 text-xs font-normal">{unit}</span>}
      </span>
    </div>
  );
}
