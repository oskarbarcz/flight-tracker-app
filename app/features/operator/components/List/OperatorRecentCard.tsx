import React from "react";
import { Link } from "react-router";
import type { Operator } from "~/features/operator";
import { OperatorFin } from "~/features/operator/components/OperatorFin";

type Props = {
  operator: Operator;
};

export function OperatorRecentCard({ operator }: Props) {
  return (
    <Link
      to={`/operators/${operator.id}/fleet`}
      viewTransition
      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-2.5 transition-colors hover:border-indigo-400 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-500 dark:hover:bg-gray-700"
    >
      <div className="flex h-11 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-50 p-1.5">
        <OperatorFin operator={operator} className="mix-blend-multiply" />
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-sm font-bold text-gray-900 dark:text-white">{operator.shortName}</h3>
        <p className="mt-0.5 flex items-baseline gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">{operator.icaoCode}</span>
          <span className="font-mono">{operator.iataCode}</span>
          <span aria-hidden className="text-gray-300 dark:text-gray-600">
            ·
          </span>
          <span className="min-w-0 truncate">
            <span className="font-mono tabular-nums text-gray-700 dark:text-gray-300">{operator.fleetSize}</span>{" "}
            aircraft
          </span>
        </p>
      </div>
    </Link>
  );
}
