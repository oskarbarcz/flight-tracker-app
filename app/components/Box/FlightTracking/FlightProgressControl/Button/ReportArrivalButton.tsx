"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";
import { describeNextActionStatus } from "~/models";

export default function ReportArrivalButton() {
  const { flight, reportArrival } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  return (
    <Button size="xs" onClick={reportArrival}>
      {describeNextActionStatus(flight.status)}
    </Button>
  );
}
