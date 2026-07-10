import { Button, Tooltip } from "flowbite-react";
import React, { useState } from "react";
import type { FlightProgressButtonProps } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import { CloseFlightModal } from "~/features/flight/components/Modal/CloseFlightModal";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { toHuman } from "~/i18n/translate";

export function CloseFlightButton({ disabled }: FlightProgressButtonProps) {
  const { flight, activeEmergency, delayRequest } = useTrackedFlight();
  const [showModal, setShowModal] = useState(false);

  if (!flight) {
    return null;
  }

  const hasUnsettledDelay = delayRequest !== null && !delayRequest.isSettled;
  const isBlocked = Boolean(activeEmergency) || hasUnsettledDelay;

  const button = (
    <Button color="indigo" outline onClick={() => setShowModal(true)} disabled={disabled || isBlocked}>
      {toHuman.flight.status.next(flight.status)}
    </Button>
  );

  const blockedReason = activeEmergency
    ? "Resolve the active emergency before closing this flight."
    : hasUnsettledDelay
      ? "Settle the delay before closing this flight."
      : null;

  return (
    <>
      {blockedReason ? (
        <Tooltip content={blockedReason}>
          <span>{button}</span>
        </Tooltip>
      ) : (
        button
      )}
      {showModal && <CloseFlightModal flight={flight} onClose={() => setShowModal(false)} />}
    </>
  );
}
