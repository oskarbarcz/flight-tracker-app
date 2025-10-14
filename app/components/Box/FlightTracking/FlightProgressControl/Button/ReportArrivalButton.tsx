"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";
import { translateNextActionStatus } from "~/models";
import { FlightProgressButtonProps } from "~/components/Box/FlightTracking/FlightProgressControl/ChangeFlightProgressButton";

export default function ReportArrivalButton({
  disabled,
}: FlightProgressButtonProps) {
  const { flight, reportArrival } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  return (
    <Button color="indigo" outline onClick={reportArrival} disabled={disabled}>
      {translateNextActionStatus(flight.status)}
    </Button>
  );
}
