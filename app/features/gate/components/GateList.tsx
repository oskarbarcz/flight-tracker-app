import React from "react";
import { HiOutlineTrash, HiPencil } from "react-icons/hi";
import { Link } from "react-router";
import { type Gate, gateCategoryOptions } from "~/features/gate";
import { groupGatesByTerminal } from "~/features/gate/lib/gateGroups";
import type { ParkingPosition } from "~/features/parking-position";
import type { Terminal } from "~/features/terminal";
import { CollapsibleTerminalSection } from "~/features/terminal/components/CollapsibleTerminalSection";
import { FactRow } from "~/shared/ui/Fact/FactRow";

type Props = {
  airportId: string;
  gates: Gate[];
  terminals: Terminal[];
  parkingPositions: ParkingPosition[];
  onDelete?: (gate: Gate) => void;
  readOnly?: boolean;
  isFiltered?: boolean;
};

function categoryLabel(value: string): string {
  return gateCategoryOptions.find((o) => o.value === value)?.label ?? value;
}

function gateCountLabel(count: number): string {
  return `${count} ${count === 1 ? "gate" : "gates"}`;
}

export function GateList({
  airportId,
  gates,
  terminals,
  parkingPositions,
  onDelete,
  readOnly,
  isFiltered = false,
}: Props) {
  const groups = groupGatesByTerminal(gates, terminals);
  const parkingPositionsById = new Map(parkingPositions.map((p) => [p.id, p]));

  return (
    <div className="space-y-4">
      {groups.map((group, index) => (
        <CollapsibleTerminalSection
          key={`${group.terminal?.id ?? "orphan"}-${isFiltered}`}
          terminal={group.terminal}
          countLabel={gateCountLabel(group.gates.length)}
          defaultCollapsed={!isFiltered && index > 0}
        >
          {group.gates.map((gate) => {
            const parkingPosition = gate.parkingPositionId
              ? (parkingPositionsById.get(gate.parkingPositionId) ?? null)
              : null;

            return (
              <article
                key={gate.id}
                className="@container overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
              >
                <header className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 py-1.5 dark:border-gray-800 dark:bg-gray-950">
                  <h4 className="flex min-w-0 flex-1 items-baseline gap-1.5">
                    <span className="shrink-0 text-sm text-gray-500 dark:text-gray-400">
                      {categoryLabel(gate.category)}
                    </span>
                    <span className="truncate font-mono text-base font-bold text-gray-900 dark:text-white">
                      {gate.name}
                    </span>
                  </h4>
                  {!readOnly && (
                    <div className="flex shrink-0 items-center">
                      <Link
                        to={`/airports/${airportId}/gates/${gate.id}/edit`}
                        viewTransition
                        aria-label={`Edit gate ${gate.name}`}
                        className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-indigo-500 @lg:p-1 dark:hover:bg-gray-800"
                      >
                        <HiPencil className="size-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDelete?.(gate)}
                        aria-label={`Delete gate ${gate.name}`}
                        className="cursor-pointer rounded-md p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500 @lg:p-1 dark:hover:bg-red-950/40"
                      >
                        <HiOutlineTrash className="size-3.5" />
                      </button>
                    </div>
                  )}
                </header>

                <dl>
                  <FactRow label="Stand">
                    {parkingPosition ? (
                      <span className="font-mono">{parkingPosition.name}</span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-600">Not linked</span>
                    )}
                  </FactRow>
                </dl>
              </article>
            );
          })}
        </CollapsibleTerminalSection>
      ))}
    </div>
  );
}
