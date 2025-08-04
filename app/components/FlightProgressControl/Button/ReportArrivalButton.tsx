"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";

export default function ReportArrivalButton() {
  const { reportArrival } = useTrackedFlight();

  const onClick = async () => {
    await reportArrival();
  };

  return <Button onClick={onClick}>Report arrival</Button>;
}
