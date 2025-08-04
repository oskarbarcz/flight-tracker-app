"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";
import { describeNextActionStatus } from "~/models";

export default function StartOffboardingButton() {
  const { flight, startOffboarding } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  const onClick = async () => {
    await startOffboarding();
  };

  return (
    <Button size="xs" onClick={onClick}>
      {describeNextActionStatus(flight.status)}
    </Button>
  );
}
