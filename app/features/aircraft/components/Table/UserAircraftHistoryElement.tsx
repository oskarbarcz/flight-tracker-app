import { TableCell, TableRow } from "flowbite-react";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";
import type { UserAircraftEntry } from "~/features/aircraft";
import { AircraftIcon } from "~/features/aircraft/components/Aircraft/AircraftIcon";
import { AircraftRegistrationLink } from "~/features/aircraft/components/Aircraft/AircraftRegistrationLink";
import { OperatorFin } from "~/features/operator/components/OperatorFin";
import { OptionAvatarFrame } from "~/shared/ui/Form/AdvancedSelect/OptionAvatarFrame";

type Props = {
  entry: UserAircraftEntry;
};

export function UserAircraftHistoryElement({ entry }: Props) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <span className="flex shrink-0">
            <AircraftIcon type={entry.airframe.type} name={entry.airframe.name} className="rounded-md" />
          </span>
          <span className="whitespace-nowrap">
            <AircraftRegistrationLink
              aircraftId={entry.id}
              registration={entry.registration}
              className="block font-mono text-lg font-bold text-gray-900 dark:text-white"
            />
            <span className="block text-xs text-gray-500 dark:text-gray-400">{entry.airframe.name}</span>
          </span>
        </div>
      </TableCell>
      <TableCell className="font-mono">{entry.airframe.type}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2 font-mono text-lg font-bold text-gray-900 dark:text-white">
          {entry.flight.departureAirport.iataCode}
          <FaArrowRight size="12" className="text-gray-500" />
          {entry.flight.arrivalAirport.iataCode}
        </div>
        <span className="block font-mono text-xs text-gray-500 dark:text-gray-400">{entry.flight.flightNumber}</span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <OptionAvatarFrame>
            <OperatorFin operator={entry.operator} className="mix-blend-multiply" />
          </OptionAvatarFrame>
          <div>
            <span className="block font-semibold text-gray-900 dark:text-white">{entry.operator.shortName}</span>
            <span className="block font-mono text-xs text-gray-500 dark:text-gray-400">{entry.operator.iataCode}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>{entry.livery}</TableCell>
      <TableCell>
        <Link className="block text-primary-500 font-bold" to={`/aircraft-history/${entry.id}`} viewTransition>
          View
        </Link>
      </TableCell>
    </TableRow>
  );
}
