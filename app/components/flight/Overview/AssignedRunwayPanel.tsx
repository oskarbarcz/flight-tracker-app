"use client";

import React from "react";
import { LuArrowDownToLine } from "react-icons/lu";
import { lightingTypeOptions, type Runway, surfaceTypeOptions } from "~/models";

type Props = {
  runway: Runway;
};

function labelOf(options: { value: string; label: string }[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

function shortLighting(value: string): string {
  return labelOf(lightingTypeOptions, value).split(" — ")[0];
}

function formatHeading(value: number | null): string | null {
  if (value === null || value === undefined) return null;
  return `${String(value).padStart(3, "0")}°`;
}

export function AssignedRunwayPanel({ runway }: Props) {
  const magnetic = formatHeading(runway.magneticHeading);
  const trueHdg = formatHeading(runway.trueHeading);

  return (
    <div className="rounded-lg border border-indigo-200 bg-indigo-50/60 dark:border-indigo-900 dark:bg-indigo-950/40">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-indigo-200/70 dark:border-indigo-900/70">
        <LuArrowDownToLine className="rotate-180 text-indigo-500" size={14} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Runway</span>
        <span className="ms-auto font-mono text-xl font-bold text-gray-900 dark:text-white">{runway.designator}</span>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 px-3 py-2.5 text-xs">
        <Row label="Length" value={`${runway.length.toLocaleString()} m`} mono />
        <Row label="Width" value={`${runway.width} m`} mono />
        <Row label="Surface" value={labelOf(surfaceTypeOptions, runway.surfaceType)} />
        <Row label="Lighting" value={shortLighting(runway.lightingType)} mono />
        {magnetic && <Row label="Heading" value={`${magnetic} M${trueHdg ? ` / ${trueHdg} T` : ""}`} mono />}
        {runway.elevation !== null && runway.elevation !== undefined && (
          <Row label="Elevation" value={`${runway.elevation} m`} mono />
        )}
        {runway.displace !== null && runway.displace !== undefined && runway.displace > 0 && (
          <Row label="Displaced" value={`${runway.displace} m`} mono />
        )}
      </dl>
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
