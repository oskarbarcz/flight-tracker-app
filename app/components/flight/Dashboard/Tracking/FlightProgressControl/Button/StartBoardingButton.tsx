"use client";

import { Button } from "flowbite-react";
import { FlightProgressButtonProps } from "~/components/flight/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import { translateNextActionStatus } from "~/models";
import { useTrackedFlight } from "~/state/contexts/global/tracked-flight.context";

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
    <Button color="indigo" outline onClick={onClick} disabled={disabled}>
      {translateNextActionStatus(flight.status)}
    </Button>
  );
}
