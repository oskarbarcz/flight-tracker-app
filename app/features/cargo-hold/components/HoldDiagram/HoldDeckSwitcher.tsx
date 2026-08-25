import React from "react";
import { twMerge } from "tailwind-merge";
import { CompartmentLoading, type HoldDeck, type HoldDeckName } from "~/features/cargo-hold/model";
import { toHuman } from "~/i18n/translate";

type Props = {
  decks: HoldDeck[];
  selected: HoldDeckName;
  onSelect: (deck: HoldDeckName) => void;
};

function summaryOf(deck: HoldDeck): string {
  const positions = deck.compartments.reduce((sum, compartment) => sum + compartment.positions.length, 0);
  if (positions > 0) {
    return `${positions} positions`;
  }

  const loose = deck.compartments.filter((compartment) => compartment.loading === CompartmentLoading.Loose).length;
  return loose === 1 ? "1 loose compartment" : `${loose} loose compartments`;
}

export function HoldDeckSwitcher({ decks, selected, onSelect }: Props) {
  return (
    <div role="tablist" aria-label="Deck" className="flex flex-wrap gap-1.5">
      {decks.map((deck) => {
        const isSelected = deck.deck === selected;

        return (
          <button
            key={deck.deck}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelect(deck.deck)}
            className={twMerge(
              "cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
              isSelected
                ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-200"
                : "border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600",
            )}
          >
            {toHuman.cargoHold.deck(deck.deck)}
            <span className="ml-1.5 font-normal text-gray-500 dark:text-gray-400">{summaryOf(deck)}</span>
          </button>
        );
      })}
    </div>
  );
}
