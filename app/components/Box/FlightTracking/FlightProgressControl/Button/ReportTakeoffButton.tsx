"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";
import { translateNextActionStatus } from "~/models";
import { FlightProgressButtonProps } from "~/components/Box/FlightTracking/FlightProgressControl/ChangeFlightProgressButton";

export default function ReportTakeoffButton({
  disabled,
}: FlightProgressButtonProps) {
  const { flight, reportTakeoff } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  const onClick = async () => {
    await reportTakeoff();
  };

  return (
    <Button color="indigo" outline onClick={onClick} disabled={disabled}>
      {translateNextActionStatus(flight.status)}
    </Button>
  );
}
