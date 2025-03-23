"use client";

import { Button } from "flowbite-react";
import { useFlight } from "~/state/hooks/useFlight";
import { Flight } from "~/models";

type ReportTakeoffButtonProps = {
  flight: Flight;
};

export default function ReportTakeoffButton({
  flight,
}: ReportTakeoffButtonProps) {
  const { reportTakeoff } = useFlight();

  const onClick = async () => {
    await reportTakeoff(flight.id);
  };

  return <Button onClick={onClick}>Report takeoff</Button>;
}
