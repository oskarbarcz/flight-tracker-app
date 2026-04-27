import { TableCell, TableRow } from "flowbite-react";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import { toHuman } from "~/i18n/translate";
import type { Flight } from "~/models";

type Props = {
  flight: Flight;
};

export function FlightListElement({ flight }: Props) {
  return (
    <TableRow key={flight.id}>
      <TableCell className="text-base text-gray-900 font-bold font-mono dark:text-white">
        {flight.flightNumberWithoutSpaces}
      </TableCell>
      <TableCell>
        <div className="flex gap-1 items-center">
          {flight.departureAirport.iataCode}
          <FaArrowRight size="12" className="text-gray-800 dark:text-white" />
          {flight.destinationAirport.iataCode}
        </div>
      </TableCell>
      <TableCell>
        {flight.timesheet.scheduled.offBlockTime && (
          <>
            <FormattedIcaoDate date={flight.timesheet.scheduled.takeoffTime} />
            {" • "}
            <FormattedIcaoTime date={flight.timesheet.scheduled.takeoffTime} />
          </>
        )}
      </TableCell>
      <TableCell>
        <div className="mb-1 text-sm">{flight.aircraft.fullName}</div>
        <span className="inline-flex min-w-16 justify-center rounded-md border border-gray-500 px-2 py-0.5 text-xs">
          {flight.aircraft.registration}
        </span>
      </TableCell>
      <TableCell>
        <span className="font-bold text-indigo-500">{toHuman.flight.status.standard(flight.status)}</span>
      </TableCell>
      <TableCell>
        <Link className="block text-primary-500 font-bold" to={`/flights/${flight.id}/overview`} viewTransition>
          View
        </Link>
      </TableCell>
    </TableRow>
  );
}
