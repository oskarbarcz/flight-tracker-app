import React from "react";
import type { DataQuality } from "~/features/airport";
import {
  DATA_QUALITY_CHIP_LABEL,
  DATA_QUALITY_ICON,
  DATA_QUALITY_TONE,
} from "~/features/airport/components/Airport/dataQuality";
import type { QualitySummary } from "~/features/airport/lib/summariseAirports";

type Props = {
  summaries: QualitySummary[];
  active: DataQuality[];
  searching: boolean;
  onToggle: (quality: DataQuality) => void;
};

const SHELL =
  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300";

const ACTIVE =
  "border-indigo-300 bg-indigo-50 text-indigo-800 dark:border-indigo-500/50 dark:bg-indigo-900/30 dark:text-indigo-200";

const RESTING =
  "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800/60";

const MUTED = "border-dashed border-gray-200 bg-transparent text-gray-400 dark:border-gray-800 dark:text-gray-600";

export function AirportQualityChips({ summaries, active, searching, onToggle }: Props) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {summaries.map(({ quality, count }) => {
        const Icon = DATA_QUALITY_ICON[quality];
        const isActive = !searching && active.includes(quality);

        return (
          <button
            key={quality}
            type="button"
            disabled={searching}
            onClick={() => onToggle(quality)}
            aria-pressed={isActive}
            className={`${SHELL} ${searching ? MUTED : isActive ? ACTIVE : RESTING} ${searching ? "cursor-default" : "cursor-pointer"}`}
          >
            <Icon className={`size-3.5 shrink-0 ${searching ? "" : DATA_QUALITY_TONE[quality]}`} aria-hidden={true} />
            <span className="flex items-baseline gap-1.5">
              <span className="font-mono tabular-nums">{count}</span>
              <span>{DATA_QUALITY_CHIP_LABEL[quality]}</span>
            </span>
          </button>
        );
      })}

      {searching && <span className="text-xs text-gray-500 dark:text-gray-400">Searching every airport.</span>}
    </div>
  );
}
