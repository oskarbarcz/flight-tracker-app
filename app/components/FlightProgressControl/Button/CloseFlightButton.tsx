"use client";

import { Button } from "flowbite-react";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";

export default function CloseFlightButton() {
  const { close } = useTrackedFlight();

  const onClick = async () => {
    await close();
  };

  return <Button onClick={onClick}>Close flight</Button>;
}
