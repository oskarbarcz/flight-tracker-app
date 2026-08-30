import React from "react";
import { FaPlane } from "react-icons/fa";
import type { AirportOnFlight, Flight } from "~/features/flight";
import { FlightIdentity } from "~/features/flight/components/FlightIdentity";
import { MONTHS_SHORT } from "~/shared/lib/date";

type Props = {
  flight: Flight;
};

function longDate(date: Date): string {
  return `${MONTHS_SHORT[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

export function FlightHeroCard({ flight }: Props) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 text-white">
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 border-l border-dashed border-white/15 md:block" />

      <div className="p-4 md:p-5">
        <div className="flex items-center justify-between gap-4">
          <FlightIdentity
            operator={flight.operator}
            flightNumber={flight.flightNumber}
            aircraftId={flight.aircraft.id}
            registration={flight.aircraft.registration}
            size="md"
            tone="onAccent"
          />
          <div className="shrink-0 text-end">
            <div className="text-[0.65rem] font-bold uppercase tracking-widest text-indigo-200 md:text-xs">Flown</div>
            <div className="whitespace-nowrap text-xs font-medium text-white md:text-sm">
              {longDate(flight.timesheet.scheduled.offBlockTime)}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-8">
          <AirportColumn airport={flight.departureAirport} align="start" />
          <FaPlane aria-hidden size={18} className="shrink-0 text-white/80" />
          <AirportColumn airport={flight.destinationAirport} align="end" />
        </div>
      </div>
    </section>
  );
}

function AirportColumn({ airport, align }: { airport: AirportOnFlight; align: "start" | "end" }) {
  return (
    <div className={`min-w-0 ${align === "end" ? "text-end" : "text-start"}`}>
      <div className="font-mono text-3xl font-bold leading-none md:text-4xl">{airport.iataCode}</div>
      <div className="mt-1 truncate text-xs font-medium text-indigo-100 md:text-sm">{airport.city.name}</div>
      <div className="truncate text-[0.65rem] text-indigo-200/80 md:text-xs">{airport.name}</div>
    </div>
  );
}
