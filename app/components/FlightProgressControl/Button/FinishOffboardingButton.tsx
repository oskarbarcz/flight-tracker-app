"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";

export default function FinishOffboardingButton() {
  const { finishOffboarding } = useTrackedFlight();

  const onClick = async () => {
    await finishOffboarding();
  };

  return <Button onClick={onClick}>Finish offboarding</Button>;
}
