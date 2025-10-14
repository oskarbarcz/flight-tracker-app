"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";
import { translateNextActionStatus } from "~/models";
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
    <Button color="indigo" outline onClick={onClick} disabled={disabled}>
      {translateNextActionStatus(flight.status)}
    </Button>
  );
}
