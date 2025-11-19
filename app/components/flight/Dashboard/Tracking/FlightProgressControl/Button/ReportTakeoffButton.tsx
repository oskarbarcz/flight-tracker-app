"use client";

import { Button } from "flowbite-react";
import { FlightProgressButtonProps } from "~/components/flight/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import { translateNextActionStatus } from "~/models";
import { useTrackedFlight } from "~/state/contexts/global/tracked-flight.context";

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
