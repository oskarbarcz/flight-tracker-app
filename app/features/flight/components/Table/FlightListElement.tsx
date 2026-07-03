import { TableCell, TableRow } from "flowbite-react";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";
import { Link } from "react-router";
import { AircraftIcon } from "~/features/aircraft/components/Aircraft/AircraftIcon";
import type { Flight } from "~/features/flight";
import { FlightStatusBadge } from "~/features/flight/components/Flight/FlightStatusBadge";
import { durationMinutes, formatDuration } from "~/shared/lib/time";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";

type Props = {
  flight: Flight;
};

export function FlightListElement({ flight }: Props) {
  return (
    <TableRow key={flight.id}>
      <TableCell className="text-lg text-gray-900 font-bold font-mono dark:text-white">
        <Link to={`/flights/${flight.id}/overview`} viewTransition className="hover:text-primary-500">
          {flight.flightNumberWithoutSpaces}
        </Link>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 font-mono text-lg font-bold text-gray-900 dark:text-white">
          <Link
            to={`/airports/${flight.departureAirport.id}/overview`}
            viewTransition
            className="hover:text-primary-500"
          >
            {flight.departureAirport.iataCode}
          </Link>
          <FaArrowRight size="14" className="text-gray-500" />
          <Link
            to={`/airports/${flight.destinationAirport.id}/overview`}
            viewTransition
            className="hover:text-primary-500"
          >
            {flight.destinationAirport.iataCode}
          </Link>
        </div>
      </TableCell>
      <TableCell>
        {flight.timesheet.scheduled.offBlockTime && (
          <>
            <div>
              <FormattedIcaoDate date={flight.timesheet.scheduled.takeoffTime} />{" "}
              <span className="font-bold">
                <FormattedIcaoTime date={flight.timesheet.scheduled.takeoffTime} />
              </span>
            </div>
            <div className="mt-0.5 font-mono text-xs text-gray-500 dark:text-gray-400">
              <span className="uppercase tracking-wide">Block:</span>{" "}
              <span className="font-bold">
                {formatDuration(
                  durationMinutes(flight.timesheet.scheduled.offBlockTime, flight.timesheet.scheduled.onBlockTime),
                )}
              </span>
            </div>
          </>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <span className="flex shrink-0">
            <AircraftIcon
              type={flight.aircraft.airframe.type}
              name={flight.aircraft.airframe.name}
              className="rounded-md"
            />
          </span>
          <span className="whitespace-nowrap">
            <Link
              to={`/operators/${flight.operator.id}/aircraft/${flight.aircraft.id}`}
              viewTransition
              className="block font-mono text-lg font-bold text-gray-900 hover:text-primary-500 dark:text-white"
            >
              {flight.aircraft.registration}
            </Link>
            <span className="block text-xs text-gray-500 dark:text-gray-400">{flight.aircraft.airframe.name}</span>
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col items-start gap-1">
          <FlightStatusBadge status={flight.status} size="sm" />
          {flight.hasActiveEmergency && (
            <span className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-white">
              <FaTriangleExclamation />
              Emergency
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Link className="block text-primary-500 font-bold" to={`/flights/${flight.id}/overview`} viewTransition>
          View
        </Link>
      </TableCell>
    </TableRow>
  );
}
