"use client";

import { Button } from "flowbite-react";
import { useFlight } from "~/state/hooks/useFlight";
import { Flight } from "~/models";

type CloseFlightButtonProps = {
  flight: Flight;
};

export default function CloseFlightButton({ flight }: CloseFlightButtonProps) {
  const { close } = useFlight();

  const onClick = async () => {
    await close(flight.id);
  };

  return <Button onClick={onClick}>Close flight</Button>;
}
