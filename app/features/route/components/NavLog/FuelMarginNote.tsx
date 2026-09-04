import React from "react";
import { formatElapsed, formatTonnesFromKilograms } from "~/features/route/lib/routeFigures";
import type { FuelMarginSummary } from "~/features/route/lib/routeInsights";

type Props = {
  margin: FuelMarginSummary;
  onSelect: (ordinal: number) => void;
};

function Figure({ kilograms }: { kilograms: number | null }) {
  return <span className="font-mono tabular-nums">{formatTonnesFromKilograms(kilograms)} t</span>;
}

export function FuelMarginNote({ margin, onSelect }: Props) {
  const { fix, fuelMarginKg } = margin.tightest;

  if (margin.isConstant) {
    return (
      <p className="text-sm text-gray-600 dark:text-gray-300">
        The plan holds <Figure kilograms={fuelMarginKg} /> above minimum on board at every fix, so the reserve is a flat
        floor under the whole route rather than a constraint that bites at one point.
      </p>
    );
  }

  return (
    <p className="text-sm text-gray-600 dark:text-gray-300">
      Margin above minimum on board is tightest at{" "}
      <button
        type="button"
        onClick={() => onSelect(fix.ordinal)}
        className="rounded font-mono font-bold text-indigo-600 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 dark:text-indigo-400"
      >
        {fix.ident}
      </button>
      , {formatElapsed(fix.elapsedSeconds)} after departure: <Figure kilograms={fix.fuel.plannedOnBoard} /> planned
      against <Figure kilograms={fix.fuel.minimumOnBoard} /> minimum, leaving <Figure kilograms={fuelMarginKg} />.
    </p>
  );
}
