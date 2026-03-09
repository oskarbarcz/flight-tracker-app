"use client";

import { Button } from "flowbite-react";
import type { FlightProgressButtonProps } from "~/components/flight/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import { toHuman } from "~/i18n/translate";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";

export default function ReportOnBlockButton({ disabled }: FlightProgressButtonProps) {
  const { flight, reportOnBlock } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  const onClick = async () => {
    await reportOnBlock();
  };
  return (
    <Button onClick={onClick} outline color="indigo" disabled={disabled}>
      {toHuman.flight.status.next(flight.status)}
    </Button>
  );
}
