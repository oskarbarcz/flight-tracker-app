"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/global/tracked-flight.context";
import { translateNextActionStatus } from "~/models";
import { FlightProgressButtonProps } from "~/components/Box/FlightTracking/FlightProgressControl/ChangeFlightProgressButton";

export default function StartOffboardingButton({
  disabled,
}: FlightProgressButtonProps) {
  const { flight, startOffboarding } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  const onClick = async () => {
    await startOffboarding();
  };

  return (
    <Button color="indigo" outline onClick={onClick} disabled={disabled}>
      {translateNextActionStatus(flight.status)}
    </Button>
  );
}
