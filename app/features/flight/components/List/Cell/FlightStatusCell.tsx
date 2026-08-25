import { Badge } from "flowbite-react";
import React from "react";
import { FaTriangleExclamation } from "react-icons/fa6";
import type { Flight } from "~/features/flight";
import { FlightStatusBadge } from "~/features/flight/components/Flight/FlightStatusBadge";
import { translateStatus } from "~/features/flight/i18n";

type Props = {
  flight: Flight;
};

export function statusLabelOf(flight: Flight): string {
  const status = translateStatus(flight.status, flight.serviceType);

  return flight.hasActiveEmergency ? `${status}, emergency declared` : status;
}

export function FlightStatusCell({ flight }: Props) {
  return (
    <span className="flex min-w-0 flex-col items-start gap-1 px-1 pt-0 pb-2.5 sm:px-3 sm:pt-2.5">
      <FlightStatusBadge status={flight.status} serviceType={flight.serviceType} />
      {flight.hasActiveEmergency && (
        <Badge color="failure" size="xs" icon={FaTriangleExclamation}>
          Emergency
        </Badge>
      )}
    </span>
  );
}
