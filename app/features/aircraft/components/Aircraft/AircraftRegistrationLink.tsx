import React from "react";
import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import { useAuth } from "~/app-state/useAuth";
import { UserRole } from "~/features/user";

type Props = {
  aircraftId: string;
  registration: string;
  className?: string;
};

export function AircraftRegistrationLink({ aircraftId, registration, className }: Props) {
  const { user } = useAuth();

  if (user?.role !== UserRole.CabinCrew) {
    return <span className={className}>{registration}</span>;
  }

  return (
    <Link
      to={`/aircraft-history/${aircraftId}`}
      viewTransition
      className={twMerge("transition-colors hover:text-primary-500", className)}
    >
      {registration}
    </Link>
  );
}
