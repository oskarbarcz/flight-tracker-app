import { Badge } from "flowbite-react";
import React from "react";
import type { UnloadSequence as Sequence } from "~/features/cargo-manifest/lib/unloadSequence";
import { ContentClass } from "~/features/cargo-manifest/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  sequence: Sequence;
};

export function UnloadSequence({ sequence }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Derived from {sequence.derivedFrom.join(", ")}.
        {sequence.compartmentKnown
          ? ""
          : " This airframe type carries no curated hold data, so compartment and door are unknown and the order uses the fields that are available."}
      </p>

      <ol className="divide-y divide-gray-200 dark:divide-gray-800">
        {sequence.order.map((entry, index) => (
          <li key={entry.unit.uldCode ?? `lot-${index}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
            <span className="w-6 shrink-0 font-mono text-sm tabular-nums text-gray-400 dark:text-gray-500">
              {index + 1}
            </span>
            <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
              {entry.unit.uldCode ?? toHuman.cargoManifest.unitKind(entry.unit.kind)}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm text-gray-600 dark:text-gray-300">
              {toHuman.cargoManifest.contentClass(entry.unit.contentClass)}
              {entry.unit.positionDesignator !== null && ` · ${entry.unit.positionDesignator}`}
            </span>
            <span className="flex flex-wrap items-center gap-1.5">
              {entry.unit.priority && <Badge color="indigo">Priority</Badge>}
              {entry.tightestConnectionMinutes !== null && (
                <Badge color="warning">{entry.tightestConnectionMinutes} min to connect</Badge>
              )}
              {entry.compartment !== null && <Badge color="gray">Compartment {entry.compartment}</Badge>}
              {entry.doorSide !== null && <Badge color="info">{toHuman.cargoHold.doorSide(entry.doorSide)}</Badge>}
            </span>
          </li>
        ))}
      </ol>

      {sequence.remainingAboard.length > 0 && (
        <div className="flex flex-col gap-1.5 rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-gray-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Stays aboard
          </span>
          <ul className="flex flex-col gap-1">
            {sequence.remainingAboard.map((entry, index) => (
              <li key={entry.unit.uldCode ?? `sealed-${index}`} className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-mono font-semibold">{entry.unit.uldCode ?? "Loose lot"}</span> transfers intact to{" "}
                {entry.unit.beyondDestination}
                {entry.unit.contentClass === ContentClass.Baggage ? ", baggage" : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
