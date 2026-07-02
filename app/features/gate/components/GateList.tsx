import { Badge } from "flowbite-react";
import React from "react";
import { HiOutlineTrash, HiPencil } from "react-icons/hi";
import { Link } from "react-router";
import { type Gate, gateCategoryOptions } from "~/features/gate";
import { groupGatesByTerminal } from "~/features/gate/lib/gateGroups";
import type { ParkingPosition } from "~/features/parking-position";
import type { Terminal } from "~/features/terminal";
import { formatCoordinates } from "~/shared/lib/formatGeo";

type Props = {
  airportId: string;
  gates: Gate[];
  terminals: Terminal[];
  parkingPositions: ParkingPosition[];
  onDelete: (gate: Gate) => void;
};

function labelOf(options: { value: string; label: string }[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function GateList({ airportId, gates, terminals, parkingPositions, onDelete }: Props) {
  const groups = groupGatesByTerminal(gates, terminals);
  const parkingPositionsById = new Map(parkingPositions.map((p) => [p.id, p]));

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
            {group.gates.map((gate) => {
              const parkingPosition = gate.parkingPositionId
                ? (parkingPositionsById.get(gate.parkingPositionId) ?? null)
                : null;
              return (
                <article
                  key={gate.id}
                  className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                >
                  <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-1.5 px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-baseline gap-2">
                      <h4 className="font-mono font-bold text-gray-900 dark:text-white">{gate.name}</h4>
                      <Badge color="indigo">{labelOf(gateCategoryOptions, gate.category)}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
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
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 px-4 py-3 text-sm">
                    <Row
                      label="Parking position"
                      value={parkingPosition ? parkingPosition.name : "Not linked"}
                      mono={Boolean(parkingPosition)}
                    />
                    <Row
                      label="Coordinates"
                      value={
                        gate.coordinates
                          ? formatCoordinates(gate.coordinates.latitude, gate.coordinates.longitude)
                          : "—"
                      }
                      mono={Boolean(gate.coordinates)}
                    />
                  </dl>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="text-gray-500">{label}:</dt>
      <dd className={`text-gray-800 dark:text-gray-200 ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}
