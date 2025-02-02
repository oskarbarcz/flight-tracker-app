"use client";

import { Button } from "flowbite-react";
import { useFlight } from "~/state/hooks/useFlight";

type StartOffboardingButtonProps = {
  flightId: string;
};

export default function StartOffboardingButton({
  flightId,
}: StartOffboardingButtonProps) {
  const { startOffboarding } = useFlight();

  const onClick = async () => {
    await startOffboarding(flightId);
  };

  return <Button onClick={onClick}>Start offboarding</Button>;
}
