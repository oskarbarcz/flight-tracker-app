import React from "react";
import { AircraftRegistrationLink } from "~/features/aircraft/components/Aircraft/AircraftRegistrationLink";
import { OperatorFin } from "~/features/operator/components/OperatorFin";

type IdentitySize = "md" | "lg";

const IDENTITY_SIZES: Record<IdentitySize, { gap: string; fin: string; flightNumber: string; registration: string }> = {
  md: { gap: "gap-2.5", fin: "size-10", flightNumber: "text-2xl", registration: "text-xs" },
  lg: { gap: "gap-3", fin: "size-12", flightNumber: "text-3xl", registration: "text-sm" },
};

type Props = {
  operator: React.ComponentProps<typeof OperatorFin>["operator"];
  flightNumber: string;
  aircraftId: string;
  registration: string;
  size?: IdentitySize;
};

export function FlightIdentity({ operator, flightNumber, aircraftId, registration, size = "lg" }: Props) {
  const scale = IDENTITY_SIZES[size];

  return (
    <div className={`flex min-w-0 items-center ${scale.gap}`}>
      <span className={`ms-1 shrink-0 ${scale.fin}`}>
        <OperatorFin operator={operator} />
      </span>
      <span className="min-w-0">
        <span
          className={`block truncate font-mono ${scale.flightNumber} font-bold leading-none text-gray-900 dark:text-white`}
        >
          {flightNumber}
        </span>
        <AircraftRegistrationLink
          aircraftId={aircraftId}
          registration={registration}
          className={`block truncate font-mono ${scale.registration} text-gray-500 dark:text-gray-400`}
        />
      </span>
    </div>
  );
}
