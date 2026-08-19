import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  years: number[];
  selected: number;
  onSelect: (year: number) => void;
};

export function YearSwitcher({ years, selected, onSelect }: Props) {
  if (years.length < 2) {
    return null;
  }

  return (
    <div
      role="tablist"
      aria-label="Year"
      className="inline-flex max-w-full shrink-0 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-700 dark:bg-gray-950"
    >
      {years.map((year, index) => {
        const isSelected = year === selected;

        return (
          <button
            key={year}
            type="button"
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelect(year)}
            onKeyDown={(event) => {
              const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
              if (step === 0) {
                return;
              }
              event.preventDefault();
              onSelect(years[(index + step + years.length) % years.length]);
            }}
            className={twMerge(
              "shrink-0 cursor-pointer rounded-md px-2.5 py-1 font-mono text-xs font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500",
              isSelected
                ? "bg-white text-indigo-600 dark:bg-gray-800 dark:text-indigo-300"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100",
            )}
          >
            {year}
          </button>
        );
      })}
    </div>
  );
}
