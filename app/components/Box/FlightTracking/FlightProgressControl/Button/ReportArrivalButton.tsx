"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";
import { describeNextActionStatus } from "~/models";
import { FlightProgressButtonProps } from "~/components/Box/FlightTracking/FlightProgressControl/ChangeFlightProgressButton";

export default function ReportArrivalButton({
  disabled,
}: FlightProgressButtonProps) {
  const { flight, reportArrival } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  return (
    <Button size="xs" onClick={reportArrival} disabled={disabled}>
      {describeNextActionStatus(flight.status)}
    </Button>
  );
}
