"use client";

import { Button } from "flowbite-react";
import { useFlight } from "~/state/hooks/useFlight";
import { Flight } from "~/models";

type ReportArrivalButtonProps = {
  flight: Flight;
};

export default function ReportArrivalButton({
  flight,
}: ReportArrivalButtonProps) {
  const { reportArrival } = useFlight();

  const onClick = async () => {
    await reportArrival(flight.id);
  };

  return <Button onClick={onClick}>Report arrival</Button>;
}
