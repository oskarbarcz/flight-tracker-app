"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";

export default function StartOffboardingButton() {
  const { startOffboarding } = useTrackedFlight();

  const onClick = async () => {
    await startOffboarding();
  };

  return <Button onClick={onClick}>Start offboarding</Button>;
}
