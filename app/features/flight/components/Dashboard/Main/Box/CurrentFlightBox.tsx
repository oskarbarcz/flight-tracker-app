import { Badge, Button } from "flowbite-react";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import { Link } from "react-router";
import { type Flight, FlightStatus } from "~/features/flight";
import { FlightProgressBar } from "~/features/flight/components/Dashboard/Main/Box/FlightProgressBar";
import { FlightIdentity } from "~/features/flight/components/FlightIdentity";
import { axisProgress, reachedLeg, resolveBlockEvents } from "~/features/flight/lib/blockEvents";
import { toHuman } from "~/i18n/translate";
import { useDateProgress } from "~/shared/hooks/useDateProgress";
import { dateDiffToReadable } from "~/shared/lib/time";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { AirportEndpoint } from "~/shared/ui/Display/AirportEndpoint";
import { BoxFooter } from "~/shared/ui/Layout/BoxFooter";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

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

  const referenceHasPassed = estimatedReference.getTime() <= Date.now();
  const countdownLabel = showDeparture ? "Time to departure: " : "Time remaining: ";
  const overdueLabel = showDeparture ? "Departing now" : "Arriving now";
  const timeRemaining = dateDiffToReadable(new Date(), estimatedReference);

  const blockEvents = resolveBlockEvents(flight.timesheet);
  const leg = reachedLeg(blockEvents);
  const legProgress = useDateProgress(leg.from?.time ?? scheduled.offBlockTime, leg.to?.time ?? scheduled.onBlockTime);
  const flightProgress = axisProgress(leg, legProgress);

  return (
    <Container padding="condensed" header={<CardHeader title="Current flight" />}>
      <article className="mt-2 flex flex-row justify-between gap-3">
        <FlightIdentity
          operator={flight.operator}
          flightNumber={flight.flightNumber}
          aircraftId={flight.aircraft.id}
          registration={flight.aircraft.registration}
        />

        <div className="shrink-0 text-right">
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

      <div className="mt-3 flex">
        <Badge color="indigo">{toHuman.flight.status.short(flight.status, flight.serviceType)}</Badge>
      </div>

      <article className="mt-5 flex items-center gap-6 lg:gap-12">
        <span className="shrink-0">
          <AirportEndpoint iataCode={flight.departureAirport.iataCode} size="lg" />
        </span>

        <FlightProgressBar percent={flightProgress} />

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

      <BoxFooter
        leading={
          <div className="flex items-center text-xs text-gray-500">
            <FaClock className="mr-1.5 inline" aria-hidden={true} />
            {referenceHasPassed ? overdueLabel : `${countdownLabel}${timeRemaining}`}
          </div>
        }
      >
        <Button color="indigo" as={Link} to={`/track/${flight.id}`} viewTransition>
          Manage
          <FaArrowRight className="ml-2 inline" aria-hidden="true" />
        </Button>
      </BoxFooter>
    </Container>
  );
}
