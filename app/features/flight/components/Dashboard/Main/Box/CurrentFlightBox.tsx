import { Button } from "flowbite-react";
import React from "react";
import { FaArrowRight, FaPlane } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import { Link } from "react-router";
import { type Flight, FlightStatus } from "~/features/flight";
import { toHuman } from "~/i18n/translate";
import { useDateProgress } from "~/shared/hooks/useDateProgress";
import { dateDiffToReadable } from "~/shared/lib/time";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

type Props = {
  flight: Flight;
};

export function CurrentFlightBox({ flight }: Props) {
  const showDeparture = [
    FlightStatus.CheckedIn,
    FlightStatus.BoardingStarted,
    FlightStatus.BoardingFinished,
    FlightStatus.TaxiingOut,
  ].includes(flight.status);

  const scheduled = flight.timesheet.scheduled;
  const estimated = flight.timesheet.estimated;

  const scheduledReference = showDeparture ? scheduled.takeoffTime : scheduled.arrivalTime;
  const estimatedReference = (showDeparture ? estimated?.takeoffTime : estimated?.arrivalTime) ?? scheduledReference;
  const delayMinutes = Math.round((estimatedReference.getTime() - scheduledReference.getTime()) / 60000);

  const timeRemaining = dateDiffToReadable(new Date(), estimatedReference);
  const timeProgress = useDateProgress(estimated?.offBlockTime ?? scheduled.offBlockTime, scheduled.onBlockTime);

  const loadsheet = flight.loadsheets.final ?? flight.loadsheets.preliminary;

  return (
    <Container padding="condensed">
      <ContainerTitle
        icon={FaPlane}
        title="Current flight"
        actions={
          <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs uppercase text-indigo-500 dark:bg-indigo-900 dark:text-indigo-300">
            {toHuman.flight.status.short(flight.status)}
          </span>
        }
      />

      <article className="mt-2 flex flex-row justify-between gap-3">
        <div>
          <span className="block font-mono text-4xl font-bold leading-none text-indigo-500">{flight.flightNumber}</span>
          <span className="mt-1.5 block font-semibold text-gray-700 text-sm dark:text-gray-300">
            {flight.operator.shortName}
          </span>
          <span className="block text-sm text-gray-500">
            {flight.aircraft.registration} · {flight.aircraft.airframe.name}
          </span>
        </div>

        <div className="text-right">
          <span className="font-mono text-xl font-bold tabular-nums text-gray-900 dark:text-white">
            <FormattedIcaoTime date={estimatedReference} />
          </span>
          <span className="mt-0.5 flex items-center justify-end gap-1.5 text-xs uppercase tracking-wide text-gray-500">
            {showDeparture ? "Est. departure" : "Est. arrival"}
            {delayMinutes > 0 && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 font-mono text-[11px] font-bold normal-case text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                +{delayMinutes}
              </span>
            )}
          </span>
        </div>
      </article>

      <article className="mt-5 grid grid-cols-[1fr_1.5fr_1fr] items-center gap-4">
        <div className="min-w-0">
          <span className="block font-mono text-3xl font-bold leading-none text-gray-900 dark:text-white">
            {flight.departureAirport.iataCode}
          </span>
          <span className="mt-1 block truncate text-sm font-bold text-gray-700 dark:text-gray-200">
            {flight.departureAirport.name}
          </span>
          <span className="block truncate text-xs text-gray-400">
            {flight.departureAirport.city}, {flight.departureAirport.country}
          </span>
        </div>

        <div className="relative h-5">
          <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded bg-gray-200 dark:bg-gray-700" />
          <div
            className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 rounded bg-indigo-500"
            style={{ width: `${timeProgress}%` }}
          />
          <span className="absolute left-0 top-1/2 size-2 -translate-y-1/2 rounded-full bg-indigo-500" />
          <span className="absolute right-0 top-1/2 size-2 -translate-y-1/2 rounded-full bg-gray-300 dark:bg-gray-600" />
          <FaPlane
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500"
            style={{ left: `${timeProgress}%` }}
          />
        </div>

        <div className="min-w-0 text-right">
          <span className="block font-mono text-3xl font-bold leading-none text-gray-900 dark:text-white">
            {flight.destinationAirport.iataCode}
          </span>
          <span className="mt-1 block truncate text-sm font-bold text-gray-700 dark:text-gray-200">
            {flight.destinationAirport.name}
          </span>
          <span className="block truncate text-xs text-gray-400">
            {flight.destinationAirport.city}, {flight.destinationAirport.country}
          </span>
        </div>
      </article>

      {loadsheet && (
        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-100 sm:grid-cols-4 dark:border-gray-800 dark:bg-gray-800">
          <Stat label="Passengers" value={loadsheet.passengers.toString()} />
          <Stat label="Cargo" value={loadsheet.cargo.toString()} unit="t" />
          <Stat label="Crew" value={`${loadsheet.flightCrew.pilots} + ${loadsheet.flightCrew.cabinCrew}`} />
          <Stat label="Block fuel" value={loadsheet.blockFuel.toString()} unit="t" />
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
        <div className="flex items-center text-xs text-gray-500">
          <FaClock className="mr-1.5 inline" />
          {showDeparture ? "Time to departure: " : "Time remaining: "}
          {timeRemaining}
        </div>
        <Button color="indigo" as={Link} to={`/track/${flight.id}`} viewTransition>
          Manage
          <FaArrowRight className="ml-2 inline" aria-hidden="true" />
        </Button>
      </div>
    </Container>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="bg-white px-3 py-2.5 dark:bg-gray-900">
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</div>
      <div className="mt-0.5 font-mono text-base font-bold text-gray-900 dark:text-gray-100">
        {value}
        {unit && <span className="ms-0.5 text-xs font-normal text-gray-400">{unit}</span>}
      </div>
    </div>
  );
}
