import { TableCell, TableRow } from "flowbite-react";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";
import type { FilledSchedule, Flight } from "~/models";

type Props = {
  flight: Flight;
};

function formatBlockTime(actual: FilledSchedule | undefined): string {
  if (!actual?.offBlockTime || !actual.onBlockTime) return "—";
  const minutes = Math.round((actual.onBlockTime.getTime() - actual.offBlockTime.getTime()) / 60_000);
  if (minutes <= 0) return "—";
  return `${Math.floor(minutes / 60)}h ${(minutes % 60).toString().padStart(2, "0")}m`;
}

export function FlightHistoryListElement({ flight }: Props) {
  const actual =
    flight.timesheet.actual?.offBlockTime &&
    flight.timesheet.actual.takeoffTime &&
    flight.timesheet.actual.arrivalTime &&
    flight.timesheet.actual.onBlockTime
      ? (flight.timesheet.actual as FilledSchedule)
      : undefined;

  return (
    <TableRow key={flight.id}>
      <TableCell className="text-base text-gray-900 font-bold font-mono dark:text-white">
        {flight.flightNumberWithoutSpaces}
      </TableCell>
      <TableCell>
        <FormattedIcaoDate date={flight.timesheet.scheduled.offBlockTime} />
      </TableCell>
      <TableCell>
        <div className="flex gap-1 items-center">
          {flight.departureAirport.iataCode}
          <FaArrowRight size="12" className="text-gray-800 dark:text-white" />
          {flight.destinationAirport.iataCode}
        </div>
      </TableCell>
      <TableCell>
        <div className="mb-1 text-sm">{flight.aircraft.airframe.name}</div>
        <span className="inline-flex min-w-16 justify-center rounded-md border border-gray-500 px-2 py-0.5 text-xs">
          {flight.aircraft.registration}
        </span>
      </TableCell>
      <TableCell className="font-mono">{formatBlockTime(actual)}</TableCell>
      <TableCell>
        <Link className="block text-primary-500 font-bold" to={`/flight-history/${flight.id}`} viewTransition>
          View
        </Link>
      </TableCell>
    </TableRow>
  );
}
