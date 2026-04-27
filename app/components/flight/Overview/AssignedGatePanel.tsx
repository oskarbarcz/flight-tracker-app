"use client";

import { Badge } from "flowbite-react";
import React from "react";
import { HiLocationMarker } from "react-icons/hi";
import {
  bridgeOptions,
  deicingOptions,
  fuelingOptionsList,
  type Gate,
  gateLocationOptions,
  groundUnitOptions,
  NoiseSensitivity,
  parkingSpotTypeOptions,
  stairsOptions,
  type Terminal,
} from "~/models";

type Props = {
  gate: Gate;
  terminal: Terminal | null;
};

function labelOf(options: { value: string; label: string }[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function AssignedGatePanel({ gate, terminal }: Props) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/40">
      <div className="flex items-center gap-2 border-b border-emerald-200/70 px-3 py-2 dark:border-emerald-900/70">
        <HiLocationMarker className="text-emerald-500" size={14} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
          Gate
        </span>
        <span className="ms-auto font-mono text-xl font-bold text-gray-900 dark:text-white">{gate.name}</span>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 px-3 py-2.5 text-xs">
        <Row label="Terminal" value={terminal?.shortName ?? "—"} mono />
        <Row label="Location" value={labelOf(gateLocationOptions, gate.location)} />
        <Row label="Bridge" value={labelOf(bridgeOptions, gate.bridge)} />
        <Row label="Stairs" value={labelOf(stairsOptions, gate.stairs)} />
        <Row label="GPU" value={labelOf(groundUnitOptions, gate.gpu)} />
        <Row label="PCA" value={labelOf(groundUnitOptions, gate.pca)} />
        <Row label="Spot" value={labelOf(parkingSpotTypeOptions, gate.parkingSpotType)} />
        <Row label="Fuel" value={labelOf(fuelingOptionsList, gate.fuelingOptions)} />
        <div className="col-span-2">
          <Row label="Deicing" value={labelOf(deicingOptions, gate.deicing)} />
        </div>
      </dl>
      {gate.noiseSensitivity === NoiseSensitivity.Yes && (
        <div className="space-y-1 border-t border-emerald-200/70 px-3 py-2 text-xs dark:border-emerald-900/70">
          <div className="flex flex-wrap items-center gap-2">
            <Badge color="yellow">Noise sensitive</Badge>
            {gate.noiseSensitivityStartTime && gate.noiseSensitivityEndTime && (
              <span className="font-mono text-gray-700 dark:text-gray-300">
                {gate.noiseSensitivityStartTime}–{gate.noiseSensitivityEndTime} UTC
              </span>
            )}
          </div>
          {gate.noiseSensitivityText && <p className="text-gray-600 dark:text-gray-300">{gate.noiseSensitivityText}</p>}
        </div>
      )}
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="text-gray-500 dark:text-gray-400">{label}:</dt>
      <dd className={`text-gray-800 dark:text-gray-100 ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}
