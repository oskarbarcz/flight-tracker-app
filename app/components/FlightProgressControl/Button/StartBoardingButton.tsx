"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";

export default function StartBoardingButton() {
  const { startBoarding } = useTrackedFlight();

  const onClick = async () => {
    await startBoarding();
  };
  return <Button onClick={onClick}>Start boarding</Button>;
}
