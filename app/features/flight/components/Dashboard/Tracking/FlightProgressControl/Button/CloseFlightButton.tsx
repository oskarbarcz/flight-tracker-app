import { Button } from "flowbite-react";
import React, { useState } from "react";
import type { FlightProgressButtonProps } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/progressButton";
import { CloseFlightModal } from "~/features/flight/components/Modal/CloseFlightModal";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { closureBlock } from "~/features/flight/lib/flightClosure";
import { toHuman } from "~/i18n/translate";

export function CloseFlightButton({ tone, label }: FlightProgressButtonProps) {
  const { flight, activeEmergency, delayRequest } = useTrackedFlight();
  const [showModal, setShowModal] = useState(false);

  if (!flight) {
    return null;
  }

  return (
    <>
      <Button
        color={tone}
        disabled={closureBlock(activeEmergency, delayRequest) !== null}
        onClick={() => setShowModal(true)}
      >
        {label ?? toHuman.flight.status.next(flight.status, flight.serviceType)}
      </Button>
      {showModal && <CloseFlightModal onClose={() => setShowModal(false)} />}
    </>
  );
}
