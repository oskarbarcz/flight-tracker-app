"use client";

import React from "react";
import { FaPlane } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import type { Flight } from "~/models";

type Props = {
  flight: Flight;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function longDate(date: Date): string {
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

export function FlightHeroCard({ flight }: Props) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 text-white shadow-lg">
      {/* Decorative perforation — boarding-pass tear strip */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 border-l border-dashed border-white/15 md:block" />

      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-10 md:p-8">
        {/* Departure side */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-200">
            <FaLock size={10} />
            <span>Flight history</span>
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-mono text-xl font-bold text-white">{flight.flightNumber}</span>
            <span className="font-mono text-sm text-indigo-200/80">{flight.callsign}</span>
          </div>
          <div className="mt-6">
            <div className="font-mono text-6xl font-bold leading-none">{flight.departureAirport.iataCode}</div>
            <div className="mt-2 text-base font-medium text-indigo-100">{flight.departureAirport.city}</div>
            <div className="text-xs text-indigo-200/80">{flight.departureAirport.name}</div>
          </div>
        </div>

        {/* Center: airplane + date */}
        <div className="flex flex-col items-center justify-center gap-3 md:gap-4">
          <PlaneSeparator />
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-indigo-200">Flown</div>
            <div className="mt-0.5 text-sm font-medium text-white">
              {longDate(flight.timesheet.scheduled.offBlockTime)}
            </div>
          </div>
        </div>

        {/* Arrival side */}
        <div className="md:text-end">
          <div className="text-xs font-bold uppercase tracking-widest text-indigo-200 md:text-end">Operated by</div>
          <div className="mt-2 text-base font-medium text-indigo-100 md:text-end">{flight.operator.shortName}</div>
          <div className="mt-6 md:text-end">
            <div className="font-mono text-6xl font-bold leading-none">{flight.destinationAirport.iataCode}</div>
            <div className="mt-2 text-base font-medium text-indigo-100">{flight.destinationAirport.city}</div>
            <div className="text-xs text-indigo-200/80">{flight.destinationAirport.name}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlaneSeparator() {
  return (
    <div className="flex w-full items-center gap-2 md:w-auto md:flex-col md:gap-2">
      <span className="h-px flex-1 bg-white/30 md:h-12 md:w-px md:flex-none" />
      <FaPlane aria-hidden size={22} className="shrink-0 text-white md:rotate-90" />
      <span className="h-px flex-1 bg-white/30 md:h-12 md:w-px md:flex-none" />
    </div>
  );
}
