"use client";

import { Badge } from "flowbite-react";
import React from "react";
import { HiOutlineDuplicate, HiOutlineTrash, HiPencil } from "react-icons/hi";
import { Link } from "react-router";
import { groupGatesByTerminal } from "~/functions/gateGroups";
import {
  bridgeOptions,
  deicingOptions,
  fuelingOptionsList,
  type Gate,
  GateLocation,
  gateLocationOptions,
  groundUnitOptions,
  NoiseSensitivity,
  parkingAssistanceOptions,
  parkingPositionTypeOptions,
  parkingSpotTypeOptions,
  stairsOptions,
  type Terminal,
} from "~/models";

type Props = {
  airportId: string;
  gates: Gate[];
  terminals: Terminal[];
  onDelete: (gate: Gate) => void;
};

function labelOf(options: { value: string; label: string }[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function GateList({ airportId, gates, terminals, onDelete }: Props) {
  const groups = groupGatesByTerminal(gates, terminals);

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <section key={group.terminal?.id ?? "orphan"} className="space-y-2">
          <header className="flex items-baseline gap-2 px-1">
            <h3 className="font-mono font-bold text-gray-900 dark:text-white">
              {group.terminal?.shortName ?? "Unassigned"}
            </h3>
            {group.terminal ? <span className="text-sm text-gray-500">{group.terminal.fullName}</span> : null}
          </header>
          <div className="space-y-2">
            {group.gates.map((gate) => (
              <article
                key={gate.id}
                className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
              >
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-1.5 px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-baseline gap-2">
                    <h4 className="font-mono font-bold text-gray-900 dark:text-white">{gate.name}</h4>
                    <Badge color={gate.location === GateLocation.Gate ? "indigo" : "gray"}>
                      {labelOf(gateLocationOptions, gate.location)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/airports/${airportId}/gates/new?duplicateFrom=${gate.id}`}
                      viewTransition
                      aria-label={`Duplicate gate ${gate.name}`}
                      className="p-2 rounded-md text-gray-500 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <HiOutlineDuplicate className="size-4" />
                    </Link>
                    <Link
                      to={`/airports/${airportId}/gates/${gate.id}/edit`}
                      viewTransition
                      aria-label={`Edit gate ${gate.name}`}
                      className="p-2 rounded-md text-gray-500 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <HiPencil className="size-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(gate)}
                      aria-label={`Delete gate ${gate.name}`}
                      className="p-2 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    >
                      <HiOutlineTrash className="size-4" />
                    </button>
                  </div>
                </header>
                <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1.5 px-4 py-3 text-sm">
                  <Row label="Bridge" value={labelOf(bridgeOptions, gate.bridge)} />
                  <Row label="Stairs" value={labelOf(stairsOptions, gate.stairs)} />
                  <Row label="Spot" value={labelOf(parkingSpotTypeOptions, gate.parkingSpotType)} />
                  <Row label="Position" value={labelOf(parkingPositionTypeOptions, gate.parkingPositionType)} />
                  <Row label="Assistance" value={labelOf(parkingAssistanceOptions, gate.parkingAssistance)} />
                  <Row label="GPU" value={labelOf(groundUnitOptions, gate.gpu)} />
                  <Row label="PCA" value={labelOf(groundUnitOptions, gate.pca)} />
                  <Row label="Fuel" value={labelOf(fuelingOptionsList, gate.fuelingOptions)} />
                  <Row label="Deicing" value={labelOf(deicingOptions, gate.deicing)} />
                </dl>
                {gate.deicingDescription ? (
                  <div className="px-4 pb-2.5 text-sm text-gray-600 dark:text-gray-300">
                    <span className="text-gray-500">Deicing notes: </span>
                    {gate.deicingDescription}
                  </div>
                ) : null}
                {gate.noiseSensitivity === NoiseSensitivity.Yes ? (
                  <div className="px-4 pb-3 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge color="yellow">Noise sensitive</Badge>
                      {gate.noiseSensitivityStartTime && gate.noiseSensitivityEndTime ? (
                        <span className="font-mono text-xs">
                          {gate.noiseSensitivityStartTime}–{gate.noiseSensitivityEndTime} UTC
                        </span>
                      ) : null}
                    </div>
                    {gate.noiseSensitivityText ? <p>{gate.noiseSensitivityText}</p> : null}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="text-gray-500">{label}:</dt>
      <dd className="text-gray-800 dark:text-gray-200">{value}</dd>
    </div>
  );
}
