import React from "react";
import type { LegLifecycle, Rotation, RotationLeg } from "~/features/rotation";
import { LegFlightNumber } from "~/features/rotation/components/LegFlightNumber";
import { LegFlightPlanBadge, legPlanState } from "~/features/rotation/components/LegFlightPlanBadge";

type Props = {
  rotation: Rotation;
  activeLegId: string | null;
  currentFlightId: string | null;
};

function markerClass(state: LegLifecycle): string {
  if (state === "done") {
    return "bg-indigo-500 dark:bg-indigo-400";
  }
  if (state === "active") {
    return "bg-indigo-500 ring-2 ring-indigo-200 dark:bg-indigo-400 dark:ring-indigo-800";
  }
  return "bg-gray-300 dark:bg-gray-700";
}

function legState(leg: RotationLeg, activeLegId: string | null): LegLifecycle {
  if (leg.isFlown) {
    return "done";
  }
  return leg.id === activeLegId ? "active" : "upcoming";
}

export function CurrentRotationLegStrip({ rotation, activeLegId, currentFlightId }: Props) {
  const legs = rotation.orderedLegs;

  return (
    <ol className="flex flex-col">
      {legs.map((leg, index) => {
        const isLast = index === legs.length - 1;

        return (
          <li key={leg.id} className="flex gap-3">
            <div className="flex flex-col items-center pt-1.5">
              <span className={`size-2.5 flex-none rounded-full ${markerClass(legState(leg, activeLegId))}`} />
              {!isLast && <span className="mt-1 w-px flex-1 bg-gray-200 dark:bg-gray-800" />}
            </div>

            <div className={`flex min-w-0 flex-1 items-baseline justify-between gap-2 ${isLast ? "" : "pb-3"}`}>
              <span className="min-w-0">
                <LegFlightNumber leg={leg} className="text-sm" />
                <span className="ms-2 whitespace-nowrap font-mono text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {leg.departure.iataCode} → {leg.arrival.iataCode}
                </span>
              </span>
              <span className="shrink-0">
                <LegFlightPlanBadge state={legPlanState(leg, currentFlightId)} />
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
