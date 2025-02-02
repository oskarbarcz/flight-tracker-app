"use client";

import { Button } from "flowbite-react";
import { useFlight } from "~/state/hooks/useFlight";

type ReportOffBlockButtonProps = {
  flightId: string;
};

export default function ReportOffBlockButton({
  flightId,
}: ReportOffBlockButtonProps) {
  const { reportOffBlock } = useFlight();

  const onClick = async () => {
    await reportOffBlock(flightId);
  };

  return <Button onClick={onClick}>Report off-block</Button>;
}
