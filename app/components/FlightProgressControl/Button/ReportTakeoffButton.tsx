"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";

export default function ReportTakeoffButton() {
  const { reportTakeoff } = useTrackedFlight();

  const onClick = async () => {
    await reportTakeoff();
  };

  return <Button onClick={onClick}>Report takeoff</Button>;
}
