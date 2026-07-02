import { TableCell, TableRow } from "flowbite-react";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";
import { type FilledSchedule, type Flight, isFilledSchedule } from "~/models";
import { durationMinutes, formatDuration } from "~/shared/lib/time";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";

type Props = {
  flight: Flight;
};

function formatBlockTime(actual: FilledSchedule | undefined): string {
  if (!actual?.offBlockTime || !actual.onBlockTime) return "—";
  const minutes = durationMinutes(actual.offBlockTime, actual.onBlockTime);
  if (minutes <= 0) return "—";
  return formatDuration(minutes);
}

export function FlightHistoryListElement({ flight }: Props) {
  const actual = isFilledSchedule(flight.timesheet.actual) ? flight.timesheet.actual : undefined;

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
