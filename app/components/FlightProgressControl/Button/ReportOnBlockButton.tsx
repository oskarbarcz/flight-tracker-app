"use client";

import { Button } from "flowbite-react";
import { useFlight } from "~/state/hooks/useFlight";
import { Flight } from "~/models";

type ReportOnBlockButtonProps = {
  flight: Flight;
};

export default function ReportOnBlockButton({
  flight,
}: ReportOnBlockButtonProps) {
  const { reportOnBlock } = useFlight();

  const onClick = async () => {
    await reportOnBlock(flight.id);
  };
  return <Button onClick={onClick}>Report on-block</Button>;
}
