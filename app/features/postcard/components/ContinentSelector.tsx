import React from "react";
import type { ContinentSummary } from "~/features/postcard/lib/groupPostcards";

type Props = {
  continents: ContinentSummary[];
  selected: string;
  onSelect: (key: string) => void;
};

export function ContinentSelector({ continents, selected, onSelect }: Props) {
  return (
    <div className="mb-4 -mx-1 overflow-x-auto px-1 pb-1">
      <div role="tablist" aria-label="Continent" className="flex w-max min-w-full gap-1.5">
        {continents.map((continent) => {
          const isSelected = continent.key === selected;
          const isEmpty = continent.postcardCount === 0;

          return (
            <button
              key={continent.key}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelect(continent.key)}
              className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
                isSelected
                  ? "border-indigo-300 bg-indigo-50 text-indigo-900 dark:border-indigo-500/60 dark:bg-indigo-900/30 dark:text-indigo-100"
                  : isEmpty
                    ? "border-dashed border-gray-200 bg-transparent text-gray-400 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-600 dark:hover:bg-gray-800/40"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800/60"
              }`}
            >
              <span className="flex items-baseline gap-2">
                <span className={isEmpty && !isSelected ? "font-medium" : "font-semibold"}>{continent.name}</span>
                <span
                  className={`font-mono text-xs tabular-nums ${
                    isSelected ? "text-indigo-700 dark:text-indigo-300" : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {continent.postcardCount}
                </span>
              </span>
              {continent.failedCount > 0 && (
                <>
                  <span aria-hidden={true} className="size-1.5 shrink-0 rounded-full bg-red-500" />
                  <span className="sr-only">{continent.failedCount} failed</span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
