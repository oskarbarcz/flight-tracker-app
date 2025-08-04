"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";
import { describeNextActionStatus } from "~/models";

export default function CloseFlightButton() {
  const { flight, close } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  const onClick = async () => {
    await close();
  };

  return (
    <Button size="xs" onClick={onClick}>
      {describeNextActionStatus(flight.status)}
    </Button>
  );
}
