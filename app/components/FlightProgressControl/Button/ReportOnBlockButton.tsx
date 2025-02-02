"use client";

import { Button } from "flowbite-react";
import { useFlight } from "~/state/hooks/useFlight";

type ReportOnBlockButtonProps = {
  flightId: string;
};

export default function ReportOnBlockButton({
  flightId,
}: ReportOnBlockButtonProps) {
  const { reportOnBlock } = useFlight();

  const onClick = async () => {
    await reportOnBlock(flightId);
  };
  return <Button onClick={onClick}>Report on-block</Button>;
}
