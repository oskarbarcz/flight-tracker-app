import React from "react";
import { FaArrowsSpin } from "react-icons/fa6";
import type { Rotation, RotationLeg } from "~/features/rotation";
import { LegFlightPlanBadge, legPlanState } from "~/features/rotation/components/LegFlightPlanBadge";
import { RotationLegItem } from "~/features/rotation/components/RotationLegItem";
import { durationMinutes } from "~/shared/lib/time";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

type Props = {
  rotation: Rotation;
  currentFlightId: string | null;
};

function turnaroundAfter(leg: RotationLeg, next: RotationLeg | undefined) {
  if (!next) {
    return null;
  }
  return {
    minutes: durationMinutes(leg.onBlockTime, next.offBlockTime),
    station: leg.arrival.id === next.departure.id ? leg.arrival.iataCode : null,
  };
}

export function PilotRotationLegs({ rotation, currentFlightId }: Props) {
  const legs = rotation.orderedLegs;

  return (
    <Container padding="condensed">
      <ContainerTitle icon={FaArrowsSpin} title="Legs" />

      <ol className="mt-1">
        {legs.map((leg, index) => (
          <RotationLegItem
            key={leg.id}
            index={index}
            leg={leg}
            isLast={index === legs.length - 1}
            turnaround={turnaroundAfter(leg, legs[index + 1])}
            linkFlightNumber={true}
            action={<LegFlightPlanBadge state={legPlanState(leg, currentFlightId)} />}
          />
        ))}
      </ol>
    </Container>
  );
}
