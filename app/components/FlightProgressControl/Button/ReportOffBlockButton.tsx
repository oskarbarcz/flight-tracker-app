"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";

export default function ReportOffBlockButton() {
  const { reportOffBlock } = useTrackedFlight();

  const onClick = async () => {
    await reportOffBlock();
  };

  return <Button onClick={onClick}>Report off-block</Button>;
}
