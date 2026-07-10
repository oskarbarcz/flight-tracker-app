import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link, useLocation } from "react-router";
import { AircraftRegistrationLink } from "~/features/aircraft/components/Aircraft/AircraftRegistrationLink";
import type { Flight } from "~/features/flight";
import { useCurrentFlight } from "~/features/flight/hooks/useCurrentFlight";
import { toHuman } from "~/i18n/translate";
import { SidebarAirportRow } from "~/shared/ui/Sidebar/Elements/SidebarAirportRow";

export function CurrentFlightNav() {
  const { currentFlight, loading } = useCurrentFlight();

  if (loading) {
    return <CurrentFlightSkeleton />;
  }

  if (!currentFlight) {
    return <CurrentFlightEmpty />;
  }

  return <CurrentFlightBlock flight={currentFlight} />;
}

function CurrentFlightBlock({ flight }: { flight: Flight }) {
  const isTrackActive = useLocation().pathname.startsWith(`/track/${flight.id}`);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/60">
      <Link
        to={`/track/${flight.id}`}
        replace
        viewTransition
        className={`block px-3 py-2.5 transition-colors ${
          isTrackActive ? "bg-indigo-100 dark:bg-gray-700" : "hover:bg-indigo-50 dark:hover:bg-gray-700/60"
        }`}
      >
        <span className="flex items-center justify-between gap-2">
          <span className="font-mono text-base font-bold text-indigo-500">{flight.flightNumber}</span>
          <span className="shrink-0 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-500 dark:bg-indigo-950 dark:text-indigo-300">
            {toHuman.flight.status.short(flight.status)}
          </span>
        </span>
        <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
          <span className="truncate">{flight.departureAirport.city}</span>
          <FaArrowRight size={9} className="shrink-0 text-gray-400" aria-hidden />
          <span className="truncate">{flight.destinationAirport.city}</span>
        </span>
      </Link>

      <div className="flex items-center justify-between gap-2 border-t border-gray-200 px-3 py-2 dark:border-gray-700">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Aircraft</span>
        <AircraftRegistrationLink
          aircraftId={flight.aircraft.id}
          registration={flight.aircraft.registration}
          className="font-mono text-sm font-semibold text-gray-600 dark:text-gray-300"
        />
      </div>

      <div className="border-t border-gray-200 py-2 dark:border-gray-700">
        <span className="mb-1 block px-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          Airports
        </span>
        <div className="flex flex-col gap-0.5">
          {flight.orderedAirports.map((airport) => (
            <SidebarAirportRow key={airport.id} id={airport.id} iataCode={airport.iataCode} name={airport.name} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CurrentFlightEmpty() {
  return (
    <div className="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-900">
      <span className="block text-sm text-gray-400">No current flight</span>
    </div>
  );
}

function CurrentFlightSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 px-3 py-2.5 dark:border-gray-700">
      <div className="h-4 w-16 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
      <div className="mt-2 h-3 w-20 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
    </div>
  );
}
