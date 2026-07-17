import { type ReactNode, useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import type { Flight, FlightPathElement } from "~/features/flight";
import { FlightDetailsDrawer } from "~/features/flight/components/Map/FullScreen/FlightDetailsDrawer";
import { JourneyRibbon } from "~/features/flight/components/Map/FullScreen/JourneyRibbon";
import {
  computeFlightProgress,
  type FlightProgress,
  formatAirportClockTime,
  humanDuration,
} from "~/features/flight/lib/flightProgress";
import { toHuman } from "~/i18n/translate";

type Props = {
  flight: Flight;
  path: FlightPathElement[];
};

function StatusPill({ live, label }: { live: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
      {live && <span className="size-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse" />}
      {label}
    </span>
  );
}

function Figure({ children, timeZone }: { children: ReactNode; timeZone?: string }) {
  return (
    <span
      className="font-mono font-semibold text-gray-700 dark:text-gray-200"
      title={timeZone ? `${timeZone} local` : undefined}
    >
      {children}
    </span>
  );
}

function EtaLine({ flight, progress }: { flight: Flight; progress: FlightProgress }) {
  const now = Date.now();
  const destTz = flight.destinationAirport.timezone;
  const depTz = flight.departureAirport.timezone;

  if (progress.phase === "arrived") {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Landed <Figure timeZone={destTz}>{formatAirportClockTime(progress.arrivalDate, destTz)}</Figure>
      </p>
    );
  }

  if (progress.phase === "preflight") {
    const untilDeparture = humanDuration(progress.departureDate.getTime() - now);
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Departs <Figure timeZone={depTz}>~{formatAirportClockTime(progress.departureDate, depTz)}</Figure>
        {untilDeparture && (
          <>
            {" · in about "}
            <Figure>{untilDeparture}</Figure>
          </>
        )}
      </p>
    );
  }

  const untilArrival = humanDuration(progress.arrivalDate.getTime() - now);
  return (
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Lands <Figure timeZone={destTz}>~{formatAirportClockTime(progress.arrivalDate, destTz)}</Figure>
      {untilArrival ? (
        <>
          {" · about "}
          <Figure>{untilArrival}</Figure>
          {" left"}
        </>
      ) : (
        " · landing now"
      )}
    </p>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">
        {label}
      </span>
      <span className="font-mono text-sm font-semibold tabular-nums text-gray-800 dark:text-gray-100">{value}</span>
    </div>
  );
}

function formatAltitude(altitude: number | undefined): string {
  if (altitude === undefined) return "—";
  return `${Math.round(altitude).toLocaleString("en-US")} ft`;
}

function formatGroundSpeed(groundSpeed: number | undefined): string {
  if (groundSpeed === undefined) return "—";
  return `${Math.round(groundSpeed)} kt`;
}

export function FlightSummaryCard({ flight, path }: Props) {
  const [expanded, setExpanded] = useState(false);
  const progress = computeFlightProgress(flight, path);
  const lastPosition = path[path.length - 1];
  const isLive = progress.phase === "enroute" && progress.hasLivePosition;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center p-0 sm:p-4">
      <section className="pointer-events-auto flex w-full flex-col gap-4 rounded-t-2xl border-t border-gray-200 bg-white p-4 shadow-[0_-6px_28px_rgba(15,23,42,0.12)] dark:border-gray-800 dark:bg-gray-900 sm:w-full sm:max-w-xl sm:rounded-2xl sm:border sm:p-5 sm:shadow-2xl">
        <div className="mx-auto h-1 w-9 shrink-0 rounded-full bg-gray-300 dark:bg-gray-700 sm:hidden" />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-base font-bold text-gray-900 dark:text-white">{flight.flightNumber}</span>
            <StatusPill live={isLive} label={toHuman.flight.status.standard(flight.status)} />
          </div>
          <div className="hidden sm:block">
            <EtaLine flight={flight} progress={progress} />
          </div>
        </div>

        <JourneyRibbon
          departure={flight.departureAirport}
          destination={flight.destinationAirport}
          fraction={progress.fraction}
        />

        <div className="sm:hidden">
          <EtaLine flight={flight} progress={progress} />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
          {isLive ? (
            <div className="flex items-center gap-4">
              <Stat label="ALT" value={formatAltitude(lastPosition?.altitude)} />
              <Stat label="GS" value={formatGroundSpeed(lastPosition?.groundSpeed)} />
            </div>
          ) : (
            <span />
          )}
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((open) => !open)}
            className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
          >
            Flight details
            <FaChevronRight className={`size-3 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`} />
          </button>
        </div>

        {expanded && <FlightDetailsDrawer flight={flight} />}
      </section>
    </div>
  );
}
