import React from "react";
import type { Rotation, RotationLeg } from "~/features/rotation";
import { LegFlightPlanBadge, legPlanState } from "~/features/rotation/components/LegFlightPlanBadge";
import { RotationLegItem } from "~/features/rotation/components/RotationLegItem";
import { durationMinutes } from "~/shared/lib/time";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

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
    <Container padding="condensed" header={<CardHeader title="Legs" />}>
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
