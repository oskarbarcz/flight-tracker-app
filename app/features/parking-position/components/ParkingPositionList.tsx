import { Badge } from "flowbite-react";
import React from "react";
import { LuCopy, LuPencil, LuTrash2 } from "react-icons/lu";
import { gateLocationOptions, NoiseSensitivity, type ParkingPosition } from "~/features/parking-position";
import { groupParkingPositionsByTerminal } from "~/features/parking-position/lib/parkingPositionGroups";
import { standFactGroups } from "~/features/parking-position/lib/standFacts";
import type { Terminal } from "~/features/terminal";
import { CollapsibleTerminalSection } from "~/features/terminal/components/CollapsibleTerminalSection";
import { RowActionButton, RowActionLink } from "~/shared/ui/Button/RowAction";
import { FactRow } from "~/shared/ui/Fact/FactRow";

type Props = {
  airportId: string;
  parkingPositions: ParkingPosition[];
  terminals: Terminal[];
  onDelete?: (parkingPosition: ParkingPosition) => void;
  readOnly?: boolean;
  isFiltered?: boolean;
};

function locationLabel(value: string): string {
  return gateLocationOptions.find((o) => o.value === value)?.label ?? value;
}

function standCountLabel(count: number): string {
  return `${count} ${count === 1 ? "stand" : "stands"}`;
}

export function ParkingPositionList({
  airportId,
  parkingPositions,
  terminals,
  onDelete,
  readOnly,
  isFiltered = false,
}: Props) {
  const groups = groupParkingPositionsByTerminal(parkingPositions, terminals);

  return (
    <div className="space-y-4">
      {groups.map((group, index) => (
        <CollapsibleTerminalSection
          key={`${group.terminal?.id ?? "orphan"}-${isFiltered}`}
          terminal={group.terminal}
          countLabel={standCountLabel(group.parkingPositions.length)}
          defaultCollapsed={!isFiltered && index > 0}
        >
          {group.parkingPositions.map((parkingPosition) => (
            <article
              key={parkingPosition.id}
              className="@container overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            >
              <header className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 py-1.5 dark:border-gray-800 dark:bg-gray-950">
                <h4 className="flex min-w-0 flex-1 items-baseline gap-1.5">
                  <span className="shrink-0 text-sm text-gray-500 dark:text-gray-400">
                    {locationLabel(parkingPosition.location)}
                  </span>
                  <span className="truncate font-mono text-base font-bold text-gray-900 dark:text-white">
                    {parkingPosition.name}
                  </span>
                </h4>
                {!readOnly && (
                  <div className="flex shrink-0 items-center">
                    <RowActionLink
                      to={`/airports/${airportId}/parking-positions/new?duplicateFrom=${parkingPosition.id}`}
                      icon={LuCopy}
                      label={`Duplicate parking stand ${parkingPosition.name}`}
                    />
                    <RowActionLink
                      to={`/airports/${airportId}/parking-positions/${parkingPosition.id}/edit`}
                      icon={LuPencil}
                      label={`Edit parking stand ${parkingPosition.name}`}
                    />
                    <RowActionButton
                      onClick={() => onDelete?.(parkingPosition)}
                      icon={LuTrash2}
                      label={`Remove parking stand ${parkingPosition.name}`}
                      tone="danger"
                    />
                  </div>
                )}
              </header>

              <dl className="divide-y divide-gray-100 dark:divide-gray-800/60">
                {standFactGroups(parkingPosition).map((factGroup) => (
                  <FactRow key={factGroup.label} label={factGroup.label}>
                    <span className="flex flex-wrap items-baseline gap-x-1.5">
                      {factGroup.facts.map((fact, factIndex) => (
                        <React.Fragment key={fact.text}>
                          {factIndex > 0 ? <span className="text-gray-300 dark:text-gray-700">·</span> : null}
                          <span className={fact.available ? undefined : "text-gray-500 dark:text-gray-400"}>
                            {fact.text}
                          </span>
                        </React.Fragment>
                      ))}
                    </span>
                  </FactRow>
                ))}
              </dl>

              {parkingPosition.deicingDescription ? (
                <p className="border-t border-gray-200 px-3 py-1.5 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                  {parkingPosition.deicingDescription}
                </p>
              ) : null}

              {parkingPosition.noiseSensitivity === NoiseSensitivity.Yes ? (
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-gray-200 px-3 py-1.5 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                  <Badge color="yellow">Noise sensitive</Badge>
                  {parkingPosition.noiseSensitivityStartTime && parkingPosition.noiseSensitivityEndTime ? (
                    <span className="font-mono text-gray-800 dark:text-gray-200">
                      {parkingPosition.noiseSensitivityStartTime}–{parkingPosition.noiseSensitivityEndTime} UTC
                    </span>
                  ) : null}
                  {parkingPosition.noiseSensitivityText ? <span>{parkingPosition.noiseSensitivityText}</span> : null}
                </div>
              ) : null}
            </article>
          ))}
        </CollapsibleTerminalSection>
      ))}
    </div>
  );
}
