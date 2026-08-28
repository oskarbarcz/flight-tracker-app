import { useState } from "react";
import type { Flight, FlightPathElement } from "~/features/flight";
import { FlightProgressBar } from "~/features/flight/components/Dashboard/Main/Box/FlightProgressBar";
import { FlightIdentity } from "~/features/flight/components/FlightIdentity";
import { FlightDetailsDrawer } from "~/features/flight/components/Map/FullScreen/FlightDetailsDrawer";
import { nextAction, nextActionCaption, resolveBlockEvents } from "~/features/flight/lib/blockEvents";
import { computeFlightProgress, type FlightProgress } from "~/features/flight/lib/flightProgress";
import { toHuman } from "~/i18n/translate";
import { dateToLocalTime } from "~/shared/ui/Date/FormattedLocalTime";
import { AirportEndpoint } from "~/shared/ui/Display/AirportEndpoint";
import { BlurReveal } from "~/shared/ui/Display/BlurReveal";
import { LabeledDivider } from "~/shared/ui/Layout/LabeledDivider";

type Props = {
  flight: Flight;
  path: FlightPathElement[];
};

function NextStage({ flight, progress }: { flight: Flight; progress: FlightProgress }) {
  const showDeparture = progress.phase === "preflight";
  const scheduled = flight.timesheet.scheduled;
  const estimated = flight.timesheet.estimated;

  const scheduledReference = showDeparture ? scheduled.takeoffTime : scheduled.arrivalTime;
  const estimatedReference = (showDeparture ? estimated?.takeoffTime : estimated?.arrivalTime) ?? scheduledReference;
  const delayMinutes = Math.round((estimatedReference.getTime() - scheduledReference.getTime()) / 60000);

  return (
    <div className="shrink-0 text-right">
      <span className="flex items-center justify-end gap-1.5 text-xs uppercase tracking-wide text-gray-500">
        {showDeparture ? "Est. departure" : "Est. arrival"}
        {delayMinutes > 0 && (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 font-mono text-[11px] font-bold normal-case text-amber-700 dark:bg-amber-950 dark:text-amber-400">
            +{delayMinutes}
          </span>
        )}
      </span>
      <span className="mt-0.5 block font-mono text-xl font-bold tabular-nums text-gray-900 dark:text-white">
        {dateToLocalTime(estimatedReference, false)}
      </span>
    </div>
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
  const upcoming = nextAction(resolveBlockEvents(flight.timesheet));

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center p-0 sm:p-4">
      <section className="pointer-events-auto flex w-full flex-col rounded-t-2xl border-t border-gray-200 bg-white p-4 shadow-[0_-6px_28px_rgba(15,23,42,0.12)] dark:border-gray-800 dark:bg-gray-900 sm:w-full sm:max-w-lg sm:rounded-2xl sm:border sm:p-5 sm:shadow-2xl">
        <div className="mx-auto mb-3 h-1 w-9 shrink-0 rounded-full bg-gray-300 dark:bg-gray-700 sm:hidden" />

        <article className="flex flex-row justify-between gap-3">
          <FlightIdentity
            operator={flight.operator}
            flightNumber={flight.flightNumber}
            aircraftId={flight.aircraft.id}
            registration={flight.aircraft.registration}
          />
          <NextStage flight={flight} progress={progress} />
        </article>

        <div className="mt-4">
          <LabeledDivider
            label={toHuman.flight.status.short(flight.status, flight.serviceType)}
            caption={upcoming === null ? undefined : nextActionCaption(upcoming, new Date())}
          />
        </div>

        <article className="mt-4 flex items-center gap-6 lg:gap-12">
          <span className="shrink-0">
            <AirportEndpoint iataCode={flight.departureAirport.iataCode} size="lg" />
          </span>

          <FlightProgressBar percent={progress.fraction * 100} />

          <span className="shrink-0">
            <AirportEndpoint iataCode={flight.destinationAirport.iataCode} size="lg" align="right" />
          </span>
        </article>

        <article className="-mt-1 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="block text-sm font-bold text-gray-700 dark:text-gray-200">
              {flight.departureAirport.name}
            </span>
            <span className="block text-xs text-gray-500 dark:text-gray-400">
              {flight.departureAirport.city.name}, {flight.departureAirport.country.name}
            </span>
          </div>

          <div className="min-w-0 text-right">
            <span className="block text-sm font-bold text-gray-700 dark:text-gray-200">
              {flight.destinationAirport.name}
            </span>
            <span className="block text-xs text-gray-500 dark:text-gray-400">
              {flight.destinationAirport.city.name}, {flight.destinationAirport.country.name}
            </span>
          </div>
        </article>

        <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-3 dark:border-gray-800">
          {isLive && (
            <div className="flex items-center gap-4">
              <Stat label="ALT" value={formatAltitude(lastPosition?.altitude)} />
              <Stat label="GS" value={formatGroundSpeed(lastPosition?.groundSpeed)} />
            </div>
          )}

          <BlurReveal
            expanded={expanded}
            onExpand={() => setExpanded(true)}
            onCollapse={() => setExpanded(false)}
            label={`Show flight details for ${flight.flightNumber}`}
            overlayLabel="Show flight details"
            collapseLabel="Hide flight details"
          >
            <FlightDetailsDrawer flight={flight} />
          </BlurReveal>
        </div>
      </section>
    </div>
  );
}
