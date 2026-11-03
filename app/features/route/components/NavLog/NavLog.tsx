import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { BelowMinimumIcon } from "~/features/route/components/FuelReport/BelowMinimumIcon";
import { FixDetail } from "~/features/route/components/NavLog/FixDetail";
import { fixName } from "~/features/route/lib/fixName";
import { fuelReportTone } from "~/features/route/lib/fuelReportStanding";
import {
  ABSENT,
  formatAltitude,
  formatDistance,
  formatElapsed,
  formatTonnesFromKilograms,
  formatWind,
} from "~/features/route/lib/routeFigures";
import type { FixInsight } from "~/features/route/lib/routeInsights";

const ACTUAL_FUEL_COLUMN = { key: "actualOnBoard", label: "Actual t", numeric: true, hideOnNarrow: true };

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
  canReportFuel: boolean;
  onReportFuel: (ordinal: number, actualOnBoard: number) => Promise<void>;
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

function columnsFor(showsActualFuel: boolean) {
  if (!showsActualFuel) {
    return COLUMNS;
  }

  const afterPlannedFuel = COLUMNS.findIndex((column) => column.key === "onBoard") + 1;

  return [...COLUMNS.slice(0, afterPlannedFuel), ACTUAL_FUEL_COLUMN, ...COLUMNS.slice(afterPlannedFuel)];
}

export function NavLog({ insights, selectedOrdinal, onSelect, canReportFuel, onReportFuel }: Props) {
  const showsActualFuel = canReportFuel || insights.some(({ fix }) => fix.fuelReport !== null);
  const columns = columnsFor(showsActualFuel);
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
    <table className={twMerge("w-full border-collapse text-left", showsActualFuel && "[&_td]:px-2 [&_th]:px-2")}>
      <caption className="sr-only">
        Planned route fixes in flown order, with altitude, elapsed time, distance, fuel on board and forecast wind.
      </caption>
      <thead className="sticky top-0 z-10">
        <tr className="bg-gray-50 dark:bg-gray-800">
          {columns.map((column) => (
            <th
              key={column.key}
              scope="col"
              className={twMerge(
                "border-b border-gray-200 px-3 py-2 text-2xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:text-gray-400",
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
              colSpan={columns.length}
              className="border-b border-gray-100 bg-white px-3 pb-1 pt-3 text-left text-2xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
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
                        "rounded font-mono text-sm font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                        isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-gray-900 dark:text-white",
                      )}
                    >
                      {fixName(fix.ident)}
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
                  {showsActualFuel && (
                    <td
                      className={twMerge(
                        "whitespace-nowrap px-3 py-1.5 text-right font-mono text-sm font-medium tabular-nums text-gray-800 dark:text-gray-100",
                        NARROW_HIDDEN,
                        fuelReportTone(fix),
                      )}
                    >
                      <BelowMinimumIcon fix={fix} />
                      {formatTonnesFromKilograms(fix.fuelReport?.actualOnBoard ?? null)}
                    </td>
                  )}
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

                {isExpanded && (
                  <FixDetail
                    insight={insight}
                    columnCount={columns.length}
                    detailId={detailId}
                    canReportFuel={canReportFuel}
                    onReportFuel={onReportFuel}
                  />
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      ))}
    </table>
  );
}
