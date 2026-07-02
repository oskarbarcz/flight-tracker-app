import { Button } from "flowbite-react";
import type { FlightProgressButtonProps } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { toHuman } from "~/i18n/translate";

export function ReportOffBlockButton({ disabled }: FlightProgressButtonProps) {
  const { flight, reportOffBlock } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  const onClick = async () => {
    await reportOffBlock();
  };

  return (
    <Button color="indigo" outline onClick={onClick} disabled={disabled}>
      {toHuman.flight.status.next(flight.status)}
    </Button>
  );
}
