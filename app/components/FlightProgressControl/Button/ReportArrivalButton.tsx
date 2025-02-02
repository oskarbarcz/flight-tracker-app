"use client";

import { Button } from "flowbite-react";
import { useFlight } from "~/state/hooks/useFlight";

type ReportArrivalButtonProps = {
  flightId: string;
};

export default function ReportArrivalButton({
  flightId,
}: ReportArrivalButtonProps) {
  const { reportArrival } = useFlight();

  const onClick = async () => {
    await reportArrival(flightId);
  };

  return <Button onClick={onClick}>Report arrival</Button>;
}
