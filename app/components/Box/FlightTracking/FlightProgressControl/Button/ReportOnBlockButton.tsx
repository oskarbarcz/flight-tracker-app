"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";
import { translateNextActionStatus } from "~/models";
import { FlightProgressButtonProps } from "~/components/Box/FlightTracking/FlightProgressControl/ChangeFlightProgressButton";

export default function ReportOnBlockButton({
  disabled,
}: FlightProgressButtonProps) {
  const { flight, reportOnBlock } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  const onClick = async () => {
    await reportOnBlock();
  };
  return (
    <Button onClick={onClick} color="indigo" disabled={disabled}>
      {translateNextActionStatus(flight.status)}
    </Button>
  );
}
