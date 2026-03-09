"use client";

import { Button } from "flowbite-react";
import type { FlightProgressButtonProps } from "~/components/flight/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import { toHuman } from "~/i18n/translate";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";

export function ReportArrivalButton({ disabled }: FlightProgressButtonProps) {
  const { flight, reportArrival } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  return (
    <Button color="indigo" outline onClick={reportArrival} disabled={disabled}>
      {toHuman.flight.status.next(flight.status)}
    </Button>
  );
}
