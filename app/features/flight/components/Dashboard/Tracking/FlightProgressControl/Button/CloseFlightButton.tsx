import { Button, Tooltip } from "flowbite-react";
import type { FlightProgressButtonProps } from "~/features/flight/components/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import { useTrackedFlight } from "~/features/flight/hooks/useTrackedFlight";
import { toHuman } from "~/i18n/translate";

export function CloseFlightButton({ disabled }: FlightProgressButtonProps) {
  const { flight, activeEmergency, close } = useTrackedFlight();

  if (!flight) {
    return null;
  }

  const onClick = async () => {
    await close();
  };

  const button = (
    <Button color="indigo" outline onClick={onClick} disabled={disabled || Boolean(activeEmergency)}>
      {toHuman.flight.status.next(flight.status)}
    </Button>
  );

  if (activeEmergency) {
    return (
      <Tooltip content="Resolve the active emergency before closing this flight.">
        <span>{button}</span>
      </Tooltip>
    );
  }

  return button;
}
