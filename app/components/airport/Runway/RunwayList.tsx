"use client";

import React from "react";
import { HiOutlineTrash, HiPencil } from "react-icons/hi";
import { Link } from "react-router";
import { groupRunwaysByPair } from "~/functions/runwayPairs";
import { type Runway, surfaceTypeOptions } from "~/models";

type Props = {
  airportId: string;
  runways: Runway[];
  onDelete: (runway: Runway) => void;
};

function surfaceLabel(value: string): string {
  return surfaceTypeOptions.find((o) => o.value === value)?.label ?? value;
}

function formatHeading(value: number | null): string {
  if (value === null || value === undefined) return "—";
  return `${String(value).padStart(3, "0")}°`;
}

export function RunwayList({ airportId, runways, onDelete }: Props) {
  const pairs = groupRunwaysByPair(runways);

  return (
    <div className="space-y-3">
      {pairs.map((pair) => {
        const shared = pair.ends[0];
        const pairLabel = pair.ends.map((e) => e.designator).join(" · ");
        return (
          <article
            key={pair.key}
            className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-1.5 px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-mono font-bold text-gray-900 dark:text-white">{pairLabel}</h3>
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-gray-500">
                <span>
                  {shared.length} × {shared.width}m
                </span>
                <span aria-hidden>·</span>
                <span>{surfaceLabel(shared.surfaceType)}</span>
                <span aria-hidden>·</span>
                <span className="font-mono">{shared.lightingType}</span>
              </div>
            </header>
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {pair.ends.map((end) => (
                <li key={end.id} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="font-mono font-bold text-gray-900 dark:text-white w-12 shrink-0">
                    {end.designator}
                  </span>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-gray-800 dark:text-gray-200">
                    <span>
                      <span className="font-mono text-gray-900 dark:text-white">
                        {formatHeading(end.magneticHeading)}
                      </span>
                      <span className="text-gray-500"> M / </span>
                      <span className="font-mono text-gray-900 dark:text-white">{formatHeading(end.trueHeading)}</span>
                      <span className="text-gray-500"> T</span>
                    </span>
                    {end.displace ? <span className="text-gray-500">· displaced {end.displace}m</span> : null}
                    {end.elevation !== null && end.elevation !== undefined ? (
                      <span className="text-gray-500">· elev {end.elevation}m</span>
                    ) : null}
                  </div>
                  <div className="ms-auto flex items-center gap-1">
                    <Link
                      to={`/airports/${airportId}/runways/${end.id}/edit`}
                      viewTransition
                      aria-label={`Edit runway ${end.designator}`}
                      className="p-2 rounded-md text-gray-500 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <HiPencil className="size-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(end)}
                      aria-label={`Delete runway ${end.designator}`}
                      className="p-2 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    >
                      <HiOutlineTrash className="size-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}
