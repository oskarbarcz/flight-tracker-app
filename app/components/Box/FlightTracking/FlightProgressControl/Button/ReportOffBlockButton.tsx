"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";
import { describeNextActionStatus } from "~/models";
import { FlightProgressButtonProps } from "~/components/Box/FlightTracking/FlightProgressControl/ChangeFlightProgressButton";

export default function ReportOffBlockButton({
  disabled,
}: FlightProgressButtonProps) {
  const { flight, reportOffBlock } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  const onClick = async () => {
    await reportOffBlock();
  };

  return (
    <Button size="xs" onClick={onClick} disabled={disabled}>
      {describeNextActionStatus(flight.status)}
    </Button>
  );
}
