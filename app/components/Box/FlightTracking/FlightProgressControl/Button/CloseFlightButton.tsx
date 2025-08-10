"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";
import { describeNextActionStatus } from "~/models";
import { FlightProgressButtonProps } from "~/components/Box/FlightTracking/FlightProgressControl/ChangeFlightProgressButton";

export default function CloseFlightButton({
  disabled,
}: FlightProgressButtonProps) {
  const { flight, close } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  const onClick = async () => {
    await close();
  };

  return (
    <Button size="xs" onClick={onClick} disabled={disabled}>
      {describeNextActionStatus(flight.status)}
    </Button>
  );
}
