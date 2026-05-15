"use client";

import { Alert, Button } from "flowbite-react";
import React from "react";
import { FaArrowRight, FaTriangleExclamation } from "react-icons/fa6";
import { Link, useLocation } from "react-router";

type Props = {
  flightId: string;
};

export function EmergencyInProgressAlert({ flightId }: Props) {
  const { pathname } = useLocation();
  const showButton = !pathname.endsWith("/emergencies");

  return (
    <Alert color="failure" icon={FaTriangleExclamation}>
      <div className="flex w-full flex-col items-center justify-between gap-3 sm:flex-row">
        <div>
          <h3 className="text-lg font-bold">Emergency in progress</h3>
          <p className="mt-1 text-sm">
            An active emergency has been declared for this flight. Review the declaration and coordinate the response
            with the crew.
          </p>
        </div>
        {showButton && (
          <Button as={Link} to={`/flights/${flightId}/emergencies`} color="red" size="sm" className="shrink-0">
            View emergency
            <FaArrowRight className="ms-2" size={12} />
          </Button>
        )}
      </div>
    </Alert>
  );
}
