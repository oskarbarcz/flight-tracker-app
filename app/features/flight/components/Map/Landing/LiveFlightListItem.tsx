import { FaArrowRight } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";
import { Link } from "react-router";
import type { Flight } from "~/features/flight";
import { FlightStatusBadge } from "~/features/flight/components/Flight/FlightStatusBadge";

type Props = {
  flight: Flight;
};

export function LiveFlightListItem({ flight }: Props) {
  return (
    <Link
      to={`/map/${flight.id}`}
      viewTransition
      className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-indigo-400 hover:bg-indigo-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500 dark:hover:bg-gray-800"
    >
      <div className="min-w-0">
        <div className="font-mono text-lg font-bold text-gray-900 dark:text-white">
          {flight.flightNumberWithoutSpaces}
        </div>
        <div className="mt-0.5 flex items-center gap-2 font-mono text-sm font-bold text-gray-600 dark:text-gray-300">
          <span>{flight.departureAirport.iataCode}</span>
          <FaArrowRight size="12" className="text-gray-400" />
          <span>{flight.destinationAirport.iataCode}</span>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <FlightStatusBadge status={flight.status} size="sm" />
        {flight.hasActiveEmergency && (
          <span className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-white">
            <FaTriangleExclamation />
            Emergency
          </span>
        )}
      </div>
    </Link>
  );
}
