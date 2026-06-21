import { Button, Tooltip } from "flowbite-react";
import type { FlightProgressButtonProps } from "~/components/flight/Dashboard/Tracking/FlightProgressControl/ChangeFlightProgressButton";
import { toHuman } from "~/i18n/translate";
import { useTrackedFlight } from "~/state/api/context/useTrackedFlight";

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
