"use client";

import { Button } from "flowbite-react";
import { useFlight } from "~/state/hooks/useFlight";

type FinishBoardingButtonProps = {
  flightId: string;
};

export default function FinishBoardingButton({
  flightId,
}: FinishBoardingButtonProps) {
  const { finishBoarding } = useFlight();

  const onClick = async () => {
    await finishBoarding(flightId);
  };

  return <Button onClick={onClick}>Finish boarding</Button>;
}
