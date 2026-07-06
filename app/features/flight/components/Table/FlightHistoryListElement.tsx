import { TableCell, TableRow } from "flowbite-react";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";
import { AircraftIcon } from "~/features/aircraft/components/Aircraft/AircraftIcon";
import { type FilledSchedule, type Flight, isFilledSchedule } from "~/features/flight";
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
        <div className="flex items-center gap-2 font-mono text-lg font-bold text-gray-900 dark:text-white">
          {flight.departureAirport.iataCode}
          <FaArrowRight size="14" className="text-gray-500" />
          {flight.destinationAirport.iataCode}
        </div>
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
            <span className="block font-mono text-lg font-bold text-gray-900 dark:text-white">
              {flight.aircraft.registration}
            </span>
            <span className="block text-xs text-gray-500 dark:text-gray-400">{flight.aircraft.airframe.name}</span>
          </span>
        </div>
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
