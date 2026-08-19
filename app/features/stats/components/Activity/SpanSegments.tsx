import React from "react";
import { twMerge } from "tailwind-merge";
import type { SpanKind } from "~/features/stats/lib/span";

const SPANS: { kind: SpanKind; title: string }[] = [
  { kind: "week", title: "Week" },
  { kind: "month", title: "Month" },
  { kind: "year", title: "Year" },
  { kind: "custom", title: "Custom" },
];

type Props = {
  selected: SpanKind;
  onSelect: (kind: SpanKind) => void;
};

export function SpanSegments({ selected, onSelect }: Props) {
  function moveSelection(index: number, key: string): boolean {
    const step = key === "ArrowRight" ? 1 : key === "ArrowLeft" ? -1 : 0;
    if (step === 0) {
      return false;
    }

    onSelect(SPANS[(index + step + SPANS.length) % SPANS.length].kind);
    return true;
  }

  return (
    <div
      role="tablist"
      aria-label="Comparison span"
      className="inline-flex shrink-0 rounded-lg border border-gray-200 bg-gray-50 p-0.5 dark:border-gray-700 dark:bg-gray-950"
    >
      {SPANS.map((span, index) => {
        const isSelected = span.kind === selected;

        return (
          <button
            key={span.kind}
            type="button"
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelect(span.kind)}
            onKeyDown={(event) => {
              if (moveSelection(index, event.key)) {
                event.preventDefault();
              }
            }}
            className={twMerge(
              "cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500",
              isSelected
                ? "bg-white text-indigo-600 dark:bg-gray-800 dark:text-indigo-300"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100",
            )}
          >
            {span.title}
          </button>
        );
      })}
    </div>
  );
}
