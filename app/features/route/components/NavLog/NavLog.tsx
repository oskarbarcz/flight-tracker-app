import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { FixDetail } from "~/features/route/components/NavLog/FixDetail";
import {
  ABSENT,
  formatAltitude,
  formatDistance,
  formatElapsed,
  formatTonnesFromKilograms,
  formatWind,
} from "~/features/route/lib/routeFigures";
import type { FixInsight } from "~/features/route/lib/routeInsights";

const COLUMNS = [
  { key: "fix", label: "Fix", numeric: false },
  { key: "airway", label: "Awy", numeric: false },
  { key: "altitude", label: "Alt", numeric: true },
  { key: "elapsed", label: "ETE", numeric: true },
  { key: "distance", label: "Dist nm", numeric: true, hideOnNarrow: true },
  { key: "onBoard", label: "FOB t", numeric: true },
  { key: "margin", label: "Margin t", numeric: true, hideOnNarrow: true },
  { key: "wind", label: "Wind", numeric: true, hideOnNarrow: true },
];

const NARROW_HIDDEN = "hidden md:table-cell";

type Props = {
  insights: FixInsight[];
  selectedOrdinal: number | null;
  onSelect: (ordinal: number) => void;
};

function stageRuns(insights: FixInsight[]): FixInsight[][] {
  return insights.reduce<FixInsight[][]>((runs, insight) => {
    const current = runs.at(-1);

    if (current === undefined || current[0].fix.stage !== insight.fix.stage) {
      runs.push([insight]);
      return runs;
    }

    current.push(insight);
    return runs;
  }, []);
}

export function NavLog({ insights, selectedOrdinal, onSelect }: Props) {
  const [expandedOrdinal, setExpandedOrdinal] = useState<number | null>(null);
  const rowRefs = useRef(new Map<number, HTMLTableRowElement>());
  const lastScrolledTo = useRef<number | null>(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      lastScrolledTo.current = selectedOrdinal;
      return;
    }

    if (selectedOrdinal === null || lastScrolledTo.current === selectedOrdinal) {
      return;
    }

    lastScrolledTo.current = selectedOrdinal;
    rowRefs.current.get(selectedOrdinal)?.scrollIntoView({ block: "nearest" });
  }, [selectedOrdinal]);

  return (
    <table className="w-full border-collapse text-left">
      <caption className="sr-only">
        Planned route fixes in flown order, with altitude, elapsed time, distance, fuel on board and forecast wind.
      </caption>
      <thead className="sticky top-0 z-10">
        <tr className="bg-gray-50 dark:bg-gray-800">
          {COLUMNS.map((column) => (
            <th
              key={column.key}
              scope="col"
              className={twMerge(
                "border-b border-gray-200 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:text-gray-400",
                column.numeric && "text-right",
                column.hideOnNarrow && NARROW_HIDDEN,
              )}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>

      {stageRuns(insights).map((run) => (
        <tbody key={`${run[0].fix.stage}-${run[0].fix.ordinal}`}>
          <tr>
            <th
              scope="rowgroup"
              colSpan={COLUMNS.length}
              className="border-b border-gray-100 bg-white px-3 pb-1 pt-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-500"
            >
              {run[0].fix.stage}
            </th>
          </tr>

          {run.map((insight) => {
            const { fix } = insight;
            const isSelected = selectedOrdinal === fix.ordinal;
            const isExpanded = expandedOrdinal === fix.ordinal;
            const detailId = `nav-log-fix-${fix.ordinal}`;

            return (
              <React.Fragment key={fix.ordinal}>
                <tr
                  ref={(element) => {
                    if (element) {
                      rowRefs.current.set(fix.ordinal, element);
                    } else {
                      rowRefs.current.delete(fix.ordinal);
                    }
                  }}
                  onMouseEnter={() => onSelect(fix.ordinal)}
                  className={twMerge(
                    "cursor-pointer border-b border-gray-100 transition-colors dark:border-gray-800",
                    isSelected ? "bg-indigo-50 dark:bg-indigo-500/10" : "hover:bg-gray-50 dark:hover:bg-gray-800/60",
                  )}
                >
                  <td className="px-3 py-1.5">
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={detailId}
                      onFocus={() => onSelect(fix.ordinal)}
                      onClick={() => setExpandedOrdinal(isExpanded ? null : fix.ordinal)}
                      className={twMerge(
                        "rounded font-mono text-sm font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300",
                        isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-gray-900 dark:text-white",
                      )}
                    >
                      {fix.ident}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-3 py-1.5 font-mono text-sm text-gray-500 dark:text-gray-400">
                    {fix.viaAirway ?? ABSENT}
                  </td>
                  <td className="whitespace-nowrap px-3 py-1.5 text-right font-mono text-sm tabular-nums text-gray-700 dark:text-gray-300">
                    {formatAltitude(fix.altitude)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-1.5 text-right font-mono text-sm tabular-nums text-gray-700 dark:text-gray-300">
                    {formatElapsed(fix.elapsedSeconds)}
                  </td>
                  <td
                    className={twMerge(
                      "whitespace-nowrap px-3 py-1.5 text-right font-mono text-sm tabular-nums text-gray-500 dark:text-gray-400",
                      NARROW_HIDDEN,
                    )}
                  >
                    {formatDistance(insight.cumulativeDistanceNm)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-1.5 text-right font-mono text-sm font-medium tabular-nums text-gray-800 dark:text-gray-100">
                    {formatTonnesFromKilograms(fix.fuel.plannedOnBoard)}
                  </td>
                  <td
                    className={twMerge(
                      "whitespace-nowrap px-3 py-1.5 text-right font-mono text-sm tabular-nums text-gray-500 dark:text-gray-400",
                      NARROW_HIDDEN,
                    )}
                  >
                    {formatTonnesFromKilograms(insight.fuelMarginKg)}
                  </td>
                  <td
                    className={twMerge(
                      "whitespace-nowrap px-3 py-1.5 text-right font-mono text-sm tabular-nums text-gray-500 dark:text-gray-400",
                      NARROW_HIDDEN,
                    )}
                  >
                    {formatWind(fix.wind.direction, fix.wind.speed)}
                  </td>
                </tr>

                {isExpanded && <FixDetail insight={insight} columnCount={COLUMNS.length} detailId={detailId} />}
              </React.Fragment>
            );
          })}
        </tbody>
      ))}
    </table>
  );
}
