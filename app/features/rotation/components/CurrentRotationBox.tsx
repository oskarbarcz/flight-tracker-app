import React from "react";
import { FaArrowsSpin, FaChevronRight } from "react-icons/fa6";
import { Link } from "react-router";
import { useCurrentFlight } from "~/features/flight/hooks/useCurrentFlight";
import type { Rotation } from "~/features/rotation";
import { CurrentRotationLegStrip } from "~/features/rotation/components/CurrentRotationLegStrip";
import { FieldLabel } from "~/shared/ui/Display/FieldLabel";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

type Props = {
  rotation: Rotation;
};

export function CurrentRotationBox({ rotation }: Props) {
  const { currentFlight } = useCurrentFlight();
  const activeLeg = rotation.activeLeg(currentFlight?.id ?? null);
  const legCount = rotation.legs.length;
  const flownCount = rotation.completedLegs.length;

  return (
    <Container padding="condensed">
      <ContainerTitle icon={FaArrowsSpin} title="Current rotation" />

      <h3 className="break-words text-base font-bold text-gray-900 dark:text-white">{rotation.name}</h3>

      <CurrentRotationLegStrip
        rotation={rotation}
        activeLegId={activeLeg?.id ?? null}
        currentFlightId={currentFlight?.id ?? null}
      />

      <div className="flex items-baseline justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
        <FieldLabel>Flown</FieldLabel>
        <span className="font-mono text-sm font-bold tabular-nums text-gray-900 dark:text-white">
          {flownCount}
          <span className="text-gray-500 dark:text-gray-400">/{legCount}</span>
        </span>
      </div>

      <Link
        to={`/rotations/${rotation.id}`}
        viewTransition
        className="group -mx-4 -mb-4 flex items-center gap-3 border-t border-gray-100 px-4 py-3.5 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400 dark:border-gray-800 dark:hover:bg-gray-800/50"
      >
        <span className="flex size-8 flex-none items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-indigo-900 dark:group-hover:text-indigo-300">
          <FaArrowsSpin size={14} aria-hidden={true} />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Rotation details</span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">See the full itinerary</span>
        </span>
        <FaChevronRight
          size={13}
          className="ms-auto flex-none text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500 motion-reduce:transition-none dark:text-gray-500"
          aria-hidden={true}
        />
      </Link>
    </Container>
  );
}
