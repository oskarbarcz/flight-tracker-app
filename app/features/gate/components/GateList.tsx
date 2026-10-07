import React from "react";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { type Gate, gateCategoryOptions } from "~/features/gate";
import { groupGatesByTerminal } from "~/features/gate/lib/gateGroups";
import type { ParkingPosition } from "~/features/parking-position";
import type { Terminal } from "~/features/terminal";
import { CollapsibleTerminalSection } from "~/features/terminal/components/CollapsibleTerminalSection";
import { RowActionButton, RowActionLink } from "~/shared/ui/Button/RowAction";
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
                      <RowActionLink
                        to={`/airports/${airportId}/gates/${gate.id}/edit`}
                        icon={LuPencil}
                        label={`Edit gate ${gate.name}`}
                      />
                      <RowActionButton
                        onClick={() => onDelete?.(gate)}
                        icon={LuTrash2}
                        label={`Remove gate ${gate.name}`}
                        tone="danger"
                      />
                    </div>
                  )}
                </header>

                <dl>
                  <FactRow label="Stand">
                    {parkingPosition ? (
                      <span className="font-mono">{parkingPosition.name}</span>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">Not linked</span>
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
