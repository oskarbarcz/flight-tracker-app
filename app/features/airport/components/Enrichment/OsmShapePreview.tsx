import React from "react";
import { projectOutlines } from "~/features/airport/lib/osmGeometry";
import type { Coordinates } from "~/shared/models/coordinates";

type Props = {
  current: Coordinates[] | null;
  proposed: Coordinates[] | null;
};

function LegendEntry({ swatch, label }: { swatch: React.ReactNode; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
      {swatch}
      {label}
    </span>
  );
}

export function OsmShapePreview({ current, proposed }: Props) {
  const { width, height, outlines } = projectOutlines([current, proposed]);
  const [currentOutline, proposedOutline] = outlines;

  if (currentOutline === "" && proposedOutline === "") {
    return null;
  }

  const strokeScale = Math.max(width, height) / 100;

  return (
    <figure className="w-fit max-w-full rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/40">
      <svg
        viewBox={`0 0 ${width.toFixed(2)} ${height.toFixed(2)}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-40 w-auto max-w-full"
        role="img"
        aria-label="Outline held today compared with the outline OpenStreetMap reports"
      >
        {currentOutline !== "" && (
          <polygon
            points={currentOutline}
            strokeDasharray={`${1.6 * strokeScale} ${1.2 * strokeScale}`}
            strokeWidth={0.7 * strokeScale}
            className="fill-gray-400/10 stroke-gray-400 dark:fill-gray-500/10 dark:stroke-gray-500"
          />
        )}
        {proposedOutline !== "" && (
          <polygon
            points={proposedOutline}
            strokeWidth={0.9 * strokeScale}
            className="fill-indigo-500/10 stroke-indigo-500 dark:stroke-indigo-400"
          />
        )}
      </svg>

      <figcaption className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        {currentOutline !== "" && (
          <LegendEntry
            swatch={<span className="h-0 w-4 border-t-2 border-dashed border-gray-400 dark:border-gray-500" />}
            label="Held today"
          />
        )}
        {proposedOutline !== "" && (
          <LegendEntry
            swatch={<span className="h-0 w-4 border-t-2 border-indigo-500 dark:border-indigo-400" />}
            label="OpenStreetMap"
          />
        )}
      </figcaption>
    </figure>
  );
}
