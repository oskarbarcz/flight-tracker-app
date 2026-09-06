import { Button } from "flowbite-react";
import type { FlightProgressButtonProps } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { toHuman } from "~/i18n/translate";

export function ReportTakeoffButton({ disabled, tone, label }: FlightProgressButtonProps) {
  const { flight, reportTakeoff } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  const onClick = async () => {
    await reportTakeoff();
  };

  return (
    <Button color={tone} outline onClick={onClick} disabled={disabled}>
      {label ?? toHuman.flight.status.next(flight.status, flight.serviceType)}
    </Button>
  );
}
