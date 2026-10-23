import React from "react";
import { FaArrowsSpin } from "react-icons/fa6";
import { useCurrentFlight } from "~/features/flight/hooks/useCurrentFlight";
import type { Rotation } from "~/features/rotation";
import { CurrentRotationLegStrip } from "~/features/rotation/components/CurrentRotationLegStrip";
import { CardFooterLink } from "~/shared/ui/Layout/CardFooterLink";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  rotation: Rotation;
};

export function CurrentRotationBox({ rotation }: Props) {
  const { currentFlight } = useCurrentFlight();
  const activeLeg = rotation.activeLeg(currentFlight?.id ?? null);

  return (
    <Container
      padding="condensed"
      header={<CardHeader title="Current rotation" />}
      footer={
        <CardFooterLink
          to={`/rotations/${rotation.id}`}
          icon={FaArrowsSpin}
          title="Rotation details"
          description="See the full itinerary"
        />
      }
    >
      <h3 className="break-words text-base font-bold text-gray-900 dark:text-white">{rotation.name}</h3>

      <CurrentRotationLegStrip
        rotation={rotation}
        activeLegId={activeLeg?.id ?? null}
        currentFlightId={currentFlight?.id ?? null}
      />
    </Container>
  );
}
