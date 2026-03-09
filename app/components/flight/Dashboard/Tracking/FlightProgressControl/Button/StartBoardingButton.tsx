"use client";

import { Button } from "flowbite-react";
import type { FlightProgressButtonProps } from "~/components/flight/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import { toHuman } from "~/i18n/translate";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";

export function StartBoardingButton({ disabled }: FlightProgressButtonProps) {
  const { flight, startBoarding } = useTrackedFlight();
  if (!flight) {
    return null;
  }

  const onClick = async () => {
    await startBoarding();
  };

  return (
    <Button color="indigo" outline onClick={onClick} disabled={disabled}>
      {toHuman.flight.status.next(flight.status)}
    </Button>
  );
}
