import { Badge } from "flowbite-react";
import React from "react";
import { HiOutlineDuplicate, HiOutlineTrash, HiPencil } from "react-icons/hi";
import { Link } from "react-router";
import {
  bridgeOptions,
  deicingOptions,
  fuelingOptionsList,
  GateLocation,
  gateLocationOptions,
  groundUnitOptions,
  NoiseSensitivity,
  type ParkingPosition,
  parkingAssistanceOptions,
  parkingPositionTypeOptions,
  parkingSpotTypeOptions,
  stairsOptions,
} from "~/features/parking-position";
import { groupParkingPositionsByTerminal } from "~/features/parking-position/lib/parkingPositionGroups";
import type { Terminal } from "~/features/terminal";

type Props = {
  airportId: string;
  parkingPositions: ParkingPosition[];
  terminals: Terminal[];
  onDelete: (parkingPosition: ParkingPosition) => void;
};

function labelOf(options: { value: string; label: string }[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function ParkingPositionList({ airportId, parkingPositions, terminals, onDelete }: Props) {
  const groups = groupParkingPositionsByTerminal(parkingPositions, terminals);

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
            {group.parkingPositions.map((parkingPosition) => (
              <article
                key={parkingPosition.id}
                className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
              >
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-1.5 px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-baseline gap-2">
                    <h4 className="font-mono font-bold text-gray-900 dark:text-white">{parkingPosition.name}</h4>
                    <Badge color={parkingPosition.location === GateLocation.Gate ? "indigo" : "gray"}>
                      {labelOf(gateLocationOptions, parkingPosition.location)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/airports/${airportId}/parking-positions/new?duplicateFrom=${parkingPosition.id}`}
                      viewTransition
                      aria-label={`Duplicate parking position ${parkingPosition.name}`}
                      className="p-2 rounded-md text-gray-500 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <HiOutlineDuplicate className="size-4" />
                    </Link>
                    <Link
                      to={`/airports/${airportId}/parking-positions/${parkingPosition.id}/edit`}
                      viewTransition
                      aria-label={`Edit parking position ${parkingPosition.name}`}
                      className="p-2 rounded-md text-gray-500 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <HiPencil className="size-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(parkingPosition)}
                      aria-label={`Delete parking position ${parkingPosition.name}`}
                      className="p-2 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    >
                      <HiOutlineTrash className="size-4" />
                    </button>
                  </div>
                </header>
                <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1.5 px-4 py-3 text-sm">
                  <Row label="Bridge" value={labelOf(bridgeOptions, parkingPosition.bridge)} />
                  <Row label="Stairs" value={labelOf(stairsOptions, parkingPosition.stairs)} />
                  <Row label="Spot" value={labelOf(parkingSpotTypeOptions, parkingPosition.spotType)} />
                  <Row label="Position" value={labelOf(parkingPositionTypeOptions, parkingPosition.type)} />
                  <Row label="Assistance" value={labelOf(parkingAssistanceOptions, parkingPosition.assistance)} />
                  <Row label="GPU" value={labelOf(groundUnitOptions, parkingPosition.gpu)} />
                  <Row label="PCA" value={labelOf(groundUnitOptions, parkingPosition.pca)} />
                  <Row label="Fuel" value={labelOf(fuelingOptionsList, parkingPosition.fuelingOptions)} />
                  <Row label="Deicing" value={labelOf(deicingOptions, parkingPosition.deicing)} />
                </dl>
                {parkingPosition.deicingDescription ? (
                  <div className="px-4 pb-2.5 text-sm text-gray-600 dark:text-gray-300">
                    <span className="text-gray-500">Deicing notes: </span>
                    {parkingPosition.deicingDescription}
                  </div>
                ) : null}
                {parkingPosition.noiseSensitivity === NoiseSensitivity.Yes ? (
                  <div className="px-4 pb-3 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge color="yellow">Noise sensitive</Badge>
                      {parkingPosition.noiseSensitivityStartTime && parkingPosition.noiseSensitivityEndTime ? (
                        <span className="font-mono text-xs">
                          {parkingPosition.noiseSensitivityStartTime}–{parkingPosition.noiseSensitivityEndTime} UTC
                        </span>
                      ) : null}
                    </div>
                    {parkingPosition.noiseSensitivityText ? <p>{parkingPosition.noiseSensitivityText}</p> : null}
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
