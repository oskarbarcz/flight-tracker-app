import React from "react";
import { twMerge } from "tailwind-merge";
import type { HoldReading } from "~/features/cargo-hold/lib/holdReading";
import type { HoldPosition } from "~/features/cargo-hold/model";

type Props = {
  positions: HoldPosition[];
  reading: HoldReading;
  hasTaper: boolean;
  hasLoose: boolean;
};

function Swatch({ className }: { className: string }) {
  return <span aria-hidden={true} className={twMerge("size-2.5 shrink-0 rounded-xs border", className)} />;
}

export function HoldLegend({ positions, reading, hasTaper, hasLoose }: Props) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
      {reading.legendFor(positions).map((entry) => (
        <li key={entry.key} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <Swatch className={entry.fill} />
          {entry.label}
        </li>
      ))}
      {hasTaper && (
        <li className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span
            aria-hidden={true}
            className="flex size-2.5 shrink-0 justify-end rounded-xs border border-gray-400 bg-gray-100 dark:border-gray-500 dark:bg-gray-700"
          >
            <span className="h-full w-[3px] bg-[repeating-linear-gradient(135deg,transparent,transparent_1.5px,rgba(17,24,39,0.55)_1.5px,rgba(17,24,39,0.55)_3px)] dark:bg-[repeating-linear-gradient(135deg,transparent,transparent_1.5px,rgba(249,250,251,0.6)_1.5px,rgba(249,250,251,0.6)_3px)]" />
          </span>
          Accepts fewer contours
        </li>
      )}
      {hasLoose && (
        <li className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span
            aria-hidden={true}
            className="size-2.5 shrink-0 rounded-xs border border-gray-300 bg-[repeating-linear-gradient(135deg,transparent,transparent_2px,rgba(107,114,128,0.3)_2px,rgba(107,114,128,0.3)_4px)] dark:border-gray-600"
          />
          Loosely loaded compartment
        </li>
      )}
    </ul>
  );
}
