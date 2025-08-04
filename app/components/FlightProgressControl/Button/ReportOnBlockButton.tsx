"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";

export default function ReportOnBlockButton() {
  const { reportOnBlock } = useTrackedFlight();

  const onClick = async () => {
    await reportOnBlock();
  };
  return <Button onClick={onClick}>Report on-block</Button>;
}
