import React from "react";
import { Link } from "react-router";
import type { Rotation } from "~/features/rotation";
import { RotationRouteChain } from "~/features/rotation/components/RotationRouteChain";
import { RotationStatusBadge } from "~/features/rotation/components/RotationStatusBadge";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";

type Props = {
  rotation: Rotation;
};

function Fact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="mt-0.5 font-mono text-sm font-bold tabular-nums text-gray-900 dark:text-gray-100">{value}</div>
    </div>
  );
}

export function PilotRotationSummaryCard({ rotation }: Props) {
  const legCount = rotation.legs.length;
  const firstLeg = rotation.firstLeg;

  return (
    <Link
      to={`/rotations/${rotation.id}`}
      viewTransition
      className="block rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-700"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <h3 className="min-w-0 break-words text-lg font-bold text-gray-900 dark:text-white">{rotation.name}</h3>
        <RotationStatusBadge status={rotation.status} size="sm" />
      </div>

      <div className="mt-3">
        <RotationRouteChain stops={rotation.routeStops} />
      </div>

      <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
        <Fact label="Legs" value={legCount} />
        <Fact
          label="Flown"
          value={
            <>
              {rotation.completedLegs.length}
              <span className="text-gray-500 dark:text-gray-400">/{legCount}</span>
            </>
          }
        />
        {firstLeg && (
          <Fact
            label="First off-block"
            value={
              <>
                <FormattedIcaoDate date={firstLeg.offBlockTime} /> <FormattedIcaoTime date={firstLeg.offBlockTime} />
              </>
            }
          />
        )}
      </div>
    </Link>
  );
}
