import { Button } from "flowbite-react";
import type { FlightProgressButtonProps } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { toHuman } from "~/i18n/translate";

export function ReportArrivalButton({ disabled, tone, label }: FlightProgressButtonProps) {
  const { flight, reportArrival } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  return (
    <Button color={tone} outline onClick={reportArrival} disabled={disabled}>
      {label ?? toHuman.flight.status.next(flight.status, flight.serviceType)}
    </Button>
  );
}
