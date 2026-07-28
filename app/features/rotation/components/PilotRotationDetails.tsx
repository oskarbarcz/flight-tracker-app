import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router";
import type { Airport } from "~/features/airport";
import { useCurrentFlight } from "~/features/flight/hooks/useCurrentFlight";
import type { Operator } from "~/features/operator";
import { formatBlockTime, type Rotation } from "~/features/rotation";
import { PilotRotationLegs } from "~/features/rotation/components/PilotRotationLegs";
import { RotationCancellationNotice } from "~/features/rotation/components/RotationCancellationNotice";
import { RotationMap } from "~/features/rotation/components/RotationMap";
import { RotationRouteRibbon } from "~/features/rotation/components/RotationRouteRibbon";
import { RotationStatusBadge } from "~/features/rotation/components/RotationStatusBadge";
import { RotationTmi } from "~/features/rotation/components/RotationTmi";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  rotation: Rotation;
  airports: Airport[];
  operator: Operator | null;
};

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <FieldLabel className="inline-block">{label}</FieldLabel>
      <span className="font-mono text-sm font-bold tabular-nums text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

export function PilotRotationDetails({ rotation, airports, operator }: Props) {
  const { currentFlight } = useCurrentFlight();
  const activeLeg = rotation.activeLeg(currentFlight?.id ?? null);
  const legCount = rotation.legs.length;

  return (
    <div className="pb-6">
      <div className="mb-3">
        <Link
          to="/rotations"
          viewTransition
          className="inline-flex items-center gap-2 rounded text-sm font-semibold text-gray-500 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FaArrowLeft size={12} aria-hidden={true} />
          Rotations
        </Link>
      </div>

      <Container padding="spacious" className="mb-4 gap-5">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="block text-xs font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
              Rotation
            </span>
            <h1 className="mt-1 break-words text-3xl font-bold text-gray-900 dark:text-white">{rotation.name}</h1>
            {operator && (
              <span className="mt-1 block truncate text-sm font-semibold text-gray-700 dark:text-gray-300">
                {operator.shortName}
                <span className="ms-1.5 font-mono text-xs font-medium text-gray-500 dark:text-gray-400">
                  {operator.icaoCode}
                </span>
              </span>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <RotationStatusBadge status={rotation.status} size="sm" />
            <RotationTmi />
          </div>
        </header>

        <RotationRouteRibbon rotation={rotation} airports={airports} activeLegId={activeLeg?.id ?? null} />

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-gray-100 pt-4 dark:border-gray-800">
          <Metric label="Legs" value={legCount} />
          <Metric label="Block time" value={formatBlockTime(rotation.totalBlockTime)} />
          <Metric label="Flown" value={`${rotation.completedLegs.length}/${legCount}`} />
        </div>
      </Container>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <PilotRotationLegs rotation={rotation} currentFlightId={currentFlight?.id ?? null} />
          {rotation.isCanceled && <RotationCancellationNotice rotation={rotation} />}
        </div>
        <RotationMap rotation={rotation} airports={airports} />
      </div>
    </div>
  );
}
