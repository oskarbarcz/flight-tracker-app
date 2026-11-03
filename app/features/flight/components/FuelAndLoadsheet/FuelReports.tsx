import React from "react";
import { twMerge } from "tailwind-merge";
import { Figure } from "~/features/flight/components/FuelAndLoadsheet/BuildUpLine";
import { Section } from "~/features/flight/components/FuelAndLoadsheet/FuelPlan";
import { BelowMinimumIcon } from "~/features/route/components/FuelReport/BelowMinimumIcon";
import { usePlannedRoute } from "~/features/route/hooks/useRouteBriefing";
import { fixName } from "~/features/route/lib/fixName";
import { fuelReportTone } from "~/features/route/lib/fuelReportStanding";
import { ABSENT, formatSignedTonnesFromKilograms } from "~/features/route/lib/routeFigures";
import type { PlannedRouteFix } from "~/features/route/model";

const DIVIDER = "border-t border-gray-200 pt-3 dark:border-gray-800";
const COLUMN_HEADING = "pb-0.5 align-bottom text-2xs font-normal text-gray-500 dark:text-gray-400";

type ListProps = {
  fixes: PlannedRouteFix[];
};

export function FuelReportList({ fixes }: ListProps) {
  const reports = fixes.flatMap((fix) =>
    fix.fuelReport === null ? [] : [{ fix, actualOnBoard: fix.fuelReport.actualOnBoard }],
  );

  if (reports.length === 0) {
    return null;
  }

  return (
    <div className={DIVIDER}>
      <Section title="Fuel reports">
        <table className="w-full table-fixed" aria-label="Fuel reports">
          <thead>
            <tr>
              <th scope="col" className={twMerge(COLUMN_HEADING, "text-left")}>
                Fix
              </th>
              <th scope="col" className={twMerge(COLUMN_HEADING, "w-20 text-right")}>
                Actual
              </th>
              <th scope="col" className={twMerge(COLUMN_HEADING, "w-15 text-right")}>
                Against EFOB
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.map(({ fix, actualOnBoard }) => (
              <FuelReportRow key={fix.ordinal} fix={fix} actualOnBoard={actualOnBoard} />
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

function FuelReportRow({ fix, actualOnBoard }: { fix: PlannedRouteFix; actualOnBoard: number }) {
  const plannedOnBoard = fix.fuel.plannedOnBoard;
  const tone = fuelReportTone(fix);

  return (
    <tr>
      <th scope="row" className="py-0.5 text-left text-xs font-normal text-gray-500 dark:text-gray-400">
        <span className="font-mono">{fixName(fix.ident)}</span>
      </th>
      <td className="py-0.5 text-right leading-5">
        <span className={tone}>
          <BelowMinimumIcon fix={fix} />
        </span>
        <Figure value={actualOnBoard / 1000} className={tone} />
      </td>
      <td className="py-0.5 text-right leading-5">
        {plannedOnBoard === null ? (
          <span className="font-mono text-sm text-gray-500 dark:text-gray-400">{ABSENT}</span>
        ) : (
          <Figure value={actualOnBoard - plannedOnBoard} format={formatSignedTonnesFromKilograms} className={tone} />
        )}
      </td>
    </tr>
  );
}

export function FuelReports() {
  const plannedRoute = usePlannedRoute();

  if (plannedRoute === null) {
    return null;
  }

  if (plannedRoute.error !== null) {
    return (
      <p className={twMerge(DIVIDER, "text-xs text-gray-500 dark:text-gray-400")}>
        Fuel reports could not be loaded. Reload the page to try again.
      </p>
    );
  }

  return <FuelReportList fixes={plannedRoute.insights.map(({ fix }) => fix)} />;
}
