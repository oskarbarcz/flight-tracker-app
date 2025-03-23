"use client";

import { Button } from "flowbite-react";
import { useFlight } from "~/state/hooks/useFlight";
import { Flight } from "~/models";

type StartOffboardingButtonProps = {
  flight: Flight;
};

export default function StartOffboardingButton({
  flight,
}: StartOffboardingButtonProps) {
  const { startOffboarding } = useFlight();

  const onClick = async () => {
    await startOffboarding(flight.id);
  };

  return <Button onClick={onClick}>Start offboarding</Button>;
}
