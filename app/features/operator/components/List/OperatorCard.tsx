import React from "react";
import { Link } from "react-router";
import { OperatorFin } from "~/components/operator/OperatorFin";
import { allianceDot } from "~/features/operator/components/List/allianceStyle";
import { allianceLabel, continentLabel, type Operator } from "~/models";

type Props = {
  operator: Operator;
};

const MAX_HUBS = 3;

export function OperatorCard({ operator }: Props) {
  const hubs = operator.hubs.slice(0, MAX_HUBS);
  const extraHubs = operator.hubs.length - hubs.length;

  return (
    <Link
      to={`/operators/${operator.id}/rotations`}
      viewTransition
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex aspect-16/9 items-center justify-center bg-gray-50 px-10 py-8">
        <OperatorFin operator={operator} className="mix-blend-multiply" />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate font-bold text-gray-900 dark:text-white">{operator.shortName}</h3>
          <span className="flex flex-none gap-1">
            <span className="rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
              {operator.icaoCode}
            </span>
            <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-500 dark:bg-gray-700 dark:text-gray-400">
              {operator.iataCode}
            </span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:text-gray-300">
            <span className={`size-1.5 rounded-full ${allianceDot(operator.alliance)}`} />
            {allianceLabel(operator.alliance) ?? "Unaligned"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{continentLabel(operator.continent)}</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {operator.hubs.length > 0 && (
            <span>
              Hubs {hubs.join(" · ")}
              {extraHubs > 0 && ` +${extraHubs}`} ·{" "}
            </span>
          )}
          <span className="font-mono tabular-nums text-gray-700 dark:text-gray-300">{operator.fleetSize}</span> aircraft
        </p>
      </div>
    </Link>
  );
}
