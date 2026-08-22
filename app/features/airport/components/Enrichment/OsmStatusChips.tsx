import { Checkbox } from "flowbite-react";
import React from "react";
import { twMerge } from "tailwind-merge";
import { changesWithStatus, WRITING_STATUSES } from "~/features/airport/lib/osmProposal";
import { OsmChangeStatus, type OsmProposedChange } from "~/features/airport/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  changes: OsmProposedChange[];
  selected: ReadonlySet<string>;
  onSelectStatus: (status: OsmChangeStatus, select: boolean) => void;
};

export function OsmStatusChips({ changes, selected, onSelectStatus }: Props) {
  const matching = changesWithStatus(changes, OsmChangeStatus.NotChanged).length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {WRITING_STATUSES.map((status) => {
        const owned = changesWithStatus(changes, status);
        if (owned.length === 0) {
          return null;
        }

        const chosen = owned.filter((change) => selected.has(change.key)).length;
        const isComplete = chosen === owned.length;

        return (
          <label
            key={status}
            htmlFor={`osm-status-${status}`}
            className={twMerge(
              "flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors",
              isComplete
                ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                : "border-gray-200 text-gray-600 hover:border-indigo-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-indigo-700",
            )}
          >
            <Checkbox
              id={`osm-status-${status}`}
              className="size-3.5"
              checked={isComplete}
              indeterminate={chosen > 0 && !isComplete}
              onChange={() => onSelectStatus(status, !isComplete)}
            />
            <span className="font-mono font-bold tabular-nums">{owned.length}</span>
            {toHuman.airport.osm.changeIntent(status)}
          </label>
        );
      })}

      {matching > 0 && (
        <span className="px-1 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-mono font-bold tabular-nums">{matching}</span>{" "}
          {toHuman.airport.osm.changeIntent(OsmChangeStatus.NotChanged)}
        </span>
      )}
    </div>
  );
}
