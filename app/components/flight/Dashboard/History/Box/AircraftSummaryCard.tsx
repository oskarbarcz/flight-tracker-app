"use client";

import React from "react";
import { GiCommercialAirplane } from "react-icons/gi";
import type { Flight } from "~/models";

type Props = {
  flight: Flight;
};

export function AircraftSummaryCard({ flight }: Props) {
  return (
    <section className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <GiCommercialAirplane
        aria-hidden
        className="absolute -right-6 -top-2 size-40 rotate-[18deg] text-gray-100 dark:text-gray-800"
      />

      <div className="relative">
        <div className="text-sm font-bold uppercase tracking-wider text-gray-500">Aircraft</div>
        <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{flight.aircraft.fullName}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {flight.aircraft.shortName}
          <span className="mx-1.5">·</span>
          {flight.aircraft.icaoCode}
        </p>
      </div>

      <div className="relative mt-6 grid grid-cols-2 gap-3">
        <Stamp label="Registration" value={flight.aircraft.registration} />
        {flight.aircraft.selcal && <Stamp label="SELCAL" value={flight.aircraft.selcal} />}
      </div>
    </section>
  );
}

function Stamp({ label, value }: { label: string; value: string }) {
  return (
    <div className="relative rounded-xl bg-gray-50 px-3 py-3 dark:bg-gray-950">
      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{label}</div>
      <div className="mt-0.5 font-mono text-base font-bold text-gray-800 dark:text-gray-100">{value}</div>
    </div>
  );
}
