"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";
import { describeNextActionStatus } from "~/models";

export default function StartBoardingButton() {
  const { flight, startBoarding } = useTrackedFlight();
  if (!flight) {
    return null;
  }

  const onClick = async () => {
    await startBoarding();
  };

  return (
    <Button size="xs" onClick={onClick}>
      {describeNextActionStatus(flight.status)}
    </Button>
  );
}
