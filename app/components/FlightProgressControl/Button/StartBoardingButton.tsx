"use client";

import { Button } from "flowbite-react";
import { useFlight } from "~/state/hooks/useFlight";
import { Flight } from "~/models";

type StartBoardingButtonProps = {
  flight: Flight;
};

export default function StartBoardingButton({
  flight,
}: StartBoardingButtonProps) {
  const { startBoarding } = useFlight();

  const onClick = async () => {
    await startBoarding(flight.id);
  };
  return <Button onClick={onClick}>Start boarding</Button>;
}
