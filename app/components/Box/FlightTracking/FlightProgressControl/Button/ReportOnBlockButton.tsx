"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";
import { describeNextActionStatus } from "~/models";

export default function ReportOnBlockButton() {
  const { flight, reportOnBlock } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  const onClick = async () => {
    await reportOnBlock();
  };
  return (
    <Button size="xs" onClick={onClick}>
      {describeNextActionStatus(flight.status)}
    </Button>
  );
}
