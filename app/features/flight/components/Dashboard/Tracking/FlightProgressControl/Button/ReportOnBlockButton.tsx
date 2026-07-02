import { Button } from "flowbite-react";
import type { FlightProgressButtonProps } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { toHuman } from "~/i18n/translate";

export function ReportOnBlockButton({ disabled }: FlightProgressButtonProps) {
  const { flight, reportOnBlock } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  const onClick = async () => {
    await reportOnBlock();
  };
  return (
    <Button onClick={onClick} outline color="indigo" disabled={disabled}>
      {toHuman.flight.status.next(flight.status)}
    </Button>
  );
}
