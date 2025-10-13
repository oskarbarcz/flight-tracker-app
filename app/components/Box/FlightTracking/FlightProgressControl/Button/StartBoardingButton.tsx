"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";
import { translateNextActionStatus } from "~/models";
import { FlightProgressButtonProps } from "~/components/Box/FlightTracking/FlightProgressControl/ChangeFlightProgressButton";

export default function StartBoardingButton({
  disabled,
}: FlightProgressButtonProps) {
  const { flight, startBoarding } = useTrackedFlight();
  if (!flight) {
    return null;
  }

  const onClick = async () => {
    await startBoarding();
  };

  return (
    <Button size="xs" onClick={onClick} disabled={disabled}>
      {translateNextActionStatus(flight.status)}
    </Button>
  );
}
