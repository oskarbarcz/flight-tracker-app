"use client";

import { Button } from "flowbite-react";
import { useFlight } from "~/state/hooks/useFlight";
import { Flight } from "~/models";

type ReportOffBlockButtonProps = {
  flight: Flight;
};

export default function ReportOffBlockButton({
  flight,
}: ReportOffBlockButtonProps) {
  const { reportOffBlock } = useFlight();

  const onClick = async () => {
    await reportOffBlock(flight.id);
  };

  return <Button onClick={onClick}>Report off-block</Button>;
}
