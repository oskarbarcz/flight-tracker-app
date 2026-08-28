import React from "react";
import { AircraftRegistrationLink } from "~/features/aircraft/components/Aircraft/AircraftRegistrationLink";
import { OperatorFin } from "~/features/operator/components/OperatorFin";

type Props = {
  operator: React.ComponentProps<typeof OperatorFin>["operator"];
  flightNumber: string;
  aircraftId: string;
  registration: string;
};

export function FlightIdentity({ operator, flightNumber, aircraftId, registration }: Props) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="ms-1 size-12 shrink-0">
        <OperatorFin operator={operator} />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-mono text-3xl font-bold leading-none text-gray-900 dark:text-white">
          {flightNumber}
        </span>
        <AircraftRegistrationLink
          aircraftId={aircraftId}
          registration={registration}
          className="block truncate font-mono text-sm text-gray-500 dark:text-gray-400"
        />
      </span>
    </div>
  );
}
