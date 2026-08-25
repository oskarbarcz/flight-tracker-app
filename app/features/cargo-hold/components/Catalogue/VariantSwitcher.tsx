import React from "react";
import { twMerge } from "tailwind-merge";
import { type HoldVariant, positionCountOf } from "~/features/cargo-hold/model";

type Props = {
  variants: HoldVariant[];
  selected: string;
  onSelect: (id: string) => void;
};

export function VariantSwitcher({ variants, selected, onSelect }: Props) {
  if (variants.length < 2) {
    return null;
  }

  return (
    <div role="tablist" aria-label="Hold variant" className="flex flex-wrap gap-1.5">
      {variants.map((variant) => {
        const isSelected = variant.id === selected;
        const positions = positionCountOf(variant);

        return (
          <button
            key={variant.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelect(variant.id)}
            className={twMerge(
              "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
              isSelected
                ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-200"
                : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600",
            )}
          >
            <span className="font-mono">{variant.id}</span>
            <span className="ml-1.5 font-normal text-gray-500 dark:text-gray-400">
              {positions === 0 ? "loose" : `${positions} positions`}
            </span>
            {variant.isDefault && (
              <span className="ml-1.5 font-normal text-gray-500 dark:text-gray-400">· default</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
