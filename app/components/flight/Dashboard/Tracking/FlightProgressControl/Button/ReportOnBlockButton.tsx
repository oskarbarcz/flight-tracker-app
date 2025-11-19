"use client";

import { Button } from "flowbite-react";
import { FlightProgressButtonProps } from "~/components/flight/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import { translateNextActionStatus } from "~/models";
import { useTrackedFlight } from "~/state/contexts/global/tracked-flight.context";

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
    <Button onClick={onClick} outline color="indigo" disabled={disabled}>
      {translateNextActionStatus(flight.status)}
    </Button>
  );
}
