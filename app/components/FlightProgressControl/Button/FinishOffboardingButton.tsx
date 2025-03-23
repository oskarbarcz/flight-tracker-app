"use client";

import { Button } from "flowbite-react";
import { useFlight } from "~/state/hooks/useFlight";
import { Flight } from "~/models";

type FinishOffboardingButtonProps = {
  flight: Flight;
};

export default function FinishOffboardingButton({
  flight,
}: FinishOffboardingButtonProps) {
  const { finishOffboarding } = useFlight();

  const onClick = async () => {
    await finishOffboarding(flight.id);
  };

  return <Button onClick={onClick}>Finish offboarding</Button>;
}
