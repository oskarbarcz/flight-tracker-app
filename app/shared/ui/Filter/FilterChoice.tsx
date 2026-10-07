import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  count?: number;
};

export function FilterChoice({ label, isSelected, onSelect, count }: Props) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onSelect}
      className={twMerge(
        "cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
        isSelected
          ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-200"
          : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600",
      )}
    >
      {label}
      {count !== undefined && (
        <span
          className={twMerge(
            "ms-1.5 font-mono tabular-nums",
            isSelected ? "text-indigo-600 dark:text-indigo-300" : "text-gray-500 dark:text-gray-400",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
