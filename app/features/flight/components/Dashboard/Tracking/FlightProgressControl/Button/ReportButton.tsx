import { Button } from "flowbite-react";
import React, { useState } from "react";
import type { FlightProgressButtonProps } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/progressButton";
import { ConfirmFlightProgressModal } from "~/features/flight/components/Modal/ConfirmFlightProgressModal";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { toHuman } from "~/i18n/translate";

type Props = FlightProgressButtonProps & {
  report: () => Promise<void>;
  failureMessage: string;
};

export function ReportButton({ tone, label, confirmNote, report, failureMessage }: Props) {
  const { flight } = useTrackedFlight();
  const [isConfirming, setIsConfirming] = useState(false);

  if (!flight) {
    return null;
  }

  const action = label ?? toHuman.flight.status.next(flight.status, flight.serviceType) ?? "Continue";

  return (
    <>
      <Button color={tone} onClick={() => setIsConfirming(true)}>
        {action}
      </Button>
      {isConfirming && (
        <ConfirmFlightProgressModal
          action={action}
          note={confirmNote}
          report={report}
          failureMessage={failureMessage}
          close={() => setIsConfirming(false)}
        />
      )}
    </>
  );
}
