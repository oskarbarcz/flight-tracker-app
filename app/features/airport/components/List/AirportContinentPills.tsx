import React from "react";
import type { Continent } from "~/features/airport";
import type { AirportContinentSummary } from "~/features/airport/lib/summariseAirports";
import { toHuman } from "~/i18n/translate";

type Props = {
  summaries: AirportContinentSummary[];
  total: number;
  selected: Continent | "";
  onSelect: (continent: Continent | "") => void;
};

const SHELL =
  "flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300";

const SELECTED =
  "border-indigo-300 bg-indigo-50 text-indigo-900 dark:border-indigo-500/60 dark:bg-indigo-900/30 dark:text-indigo-100";

const EMPTY =
  "border-dashed border-gray-200 bg-transparent text-gray-400 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-600 dark:hover:bg-gray-800/40";

const RESTING =
  "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800/60";

function Pill({
  name,
  count,
  lowCount,
  isSelected,
  onSelect,
}: {
  name: string;
  count: number;
  lowCount: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const isEmpty = count === 0;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      onClick={onSelect}
      className={`${SHELL} ${isSelected ? SELECTED : isEmpty ? EMPTY : RESTING}`}
    >
      <span className="flex items-baseline gap-2">
        <span className={isEmpty && !isSelected ? "font-medium" : "font-semibold"}>{name}</span>
        <span
          className={`font-mono text-xs tabular-nums ${
            isSelected ? "text-indigo-700 dark:text-indigo-300" : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {count}
        </span>
      </span>
      {lowCount > 0 && (
        <>
          <span aria-hidden={true} className="size-1.5 shrink-0 rounded-full bg-amber-500" />
          <span className="sr-only">{lowCount} low quality</span>
        </>
      )}
    </button>
  );
}

export function AirportContinentPills({ summaries, total, selected, onSelect }: Props) {
  return (
    <div className="mb-4 -mx-1 overflow-x-auto px-1 pb-1">
      <div role="tablist" aria-label="Continent" className="flex w-max min-w-full gap-1.5">
        <Pill name="Everywhere" count={total} lowCount={0} isSelected={selected === ""} onSelect={() => onSelect("")} />
        {summaries.map((summary) => (
          <Pill
            key={summary.continent}
            name={toHuman.airport.continent(summary.continent)}
            count={summary.count}
            lowCount={summary.lowCount}
            isSelected={summary.continent === selected}
            onSelect={() => onSelect(summary.continent)}
          />
        ))}
      </div>
    </div>
  );
}
