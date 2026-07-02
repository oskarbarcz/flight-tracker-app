import { Badge } from "flowbite-react";
import React from "react";
import { FlightStatus } from "~/features/flight";
import { translateStatus } from "~/features/flight/i18n";

type BadgeColor = "success" | "info" | "indigo" | "gray";

const statusColor: Record<FlightStatus, BadgeColor> = {
  [FlightStatus.Created]: "indigo",
  [FlightStatus.Ready]: "indigo",
  [FlightStatus.CheckedIn]: "indigo",
  [FlightStatus.BoardingStarted]: "indigo",
  [FlightStatus.BoardingFinished]: "indigo",
  [FlightStatus.TaxiingOut]: "info",
  [FlightStatus.InCruise]: "info",
  [FlightStatus.TaxiingIn]: "info",
  [FlightStatus.OnBlock]: "success",
  [FlightStatus.OffboardingStarted]: "success",
  [FlightStatus.OffboardingFinished]: "success",
  [FlightStatus.Closed]: "gray",
};

type Props = {
  status: FlightStatus;
  size?: "xs" | "sm";
};

export function FlightStatusBadge({ status, size = "xs" }: Props) {
  return (
    <Badge color={statusColor[status]} size={size}>
      {translateStatus(status)}
    </Badge>
  );
}
