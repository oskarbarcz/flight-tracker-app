import { Button } from "flowbite-react";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";
import type { Flight } from "~/features/flight";
import { DelayBadge } from "~/features/flight/components/Dashboard/Main/Box/DelayBadge";
import { FlightProgressBar } from "~/features/flight/components/Dashboard/Main/Box/FlightProgressBar";
import { FlightIdentity } from "~/features/flight/components/FlightIdentity";
import {
  axisProgress,
  blockEventLabel,
  blockReference,
  nextAction,
  nextActionCaption,
  reachedLeg,
  resolveBlockEvents,
} from "~/features/flight/lib/blockEvents";
import { toHuman } from "~/i18n/translate";
import { useDateProgress } from "~/shared/hooks/useDateProgress";
import { isSameUtcDay } from "~/shared/lib/date";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { AirportEndpoint } from "~/shared/ui/Display/AirportEndpoint";
import { BoxFooter } from "~/shared/ui/Layout/BoxFooter";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";
import { LabeledDivider } from "~/shared/ui/Layout/LabeledDivider";

type Props = {
  flight: Flight;
};

export function CurrentFlightBox({ flight }: Props) {
  const scheduled = flight.timesheet.scheduled;
  const blockEvents = resolveBlockEvents(flight.timesheet);
  const reference = blockReference(blockEvents);
  const referenceIsToday = isSameUtcDay(reference.time, new Date());

  const leg = reachedLeg(blockEvents);
  const legProgress = useDateProgress(leg.from?.time ?? scheduled.offBlockTime, leg.to?.time ?? scheduled.onBlockTime);
  const flightProgress = axisProgress(leg, legProgress);
  const upcoming = nextAction(blockEvents);

  return (
    <Container padding="condensed" header={<CardHeader title="Current flight" />}>
      <div className="mt-2 flex flex-row justify-between gap-3">
        <div className="shrink-0">
          <FlightIdentity
            operator={flight.operator}
            flightNumber={flight.flightNumber}
            aircraftId={flight.aircraft.id}
            registration={flight.aircraft.registration}
          />
        </div>

        <div className="flex min-w-0 flex-col items-end gap-1 text-right">
          <span className="whitespace-nowrap font-mono text-xl font-bold tabular-nums text-gray-900 dark:text-white">
            <FormattedIcaoTime date={reference.time} />
          </span>
          <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {blockEventLabel(reference)}
          </span>
          {!referenceIsToday && (
            <span className="text-2xs text-gray-500 dark:text-gray-400">
              <FormattedIcaoDate date={reference.time} />
            </span>
          )}
          <DelayBadge minutes={reference.delayMinutes} />
        </div>
      </div>

      <div className="mt-4">
        <LabeledDivider
          label={toHuman.flight.status.short(flight.status, flight.serviceType)}
          caption={upcoming === null ? undefined : nextActionCaption(upcoming, new Date())}
        />
      </div>

      <div className="mt-4 flex items-center gap-6 lg:gap-12">
        <span className="shrink-0">
          <AirportEndpoint iataCode={flight.departureAirport.iataCode} size="lg" />
        </span>

        <FlightProgressBar percent={flightProgress} />

        <span className="shrink-0">
          <AirportEndpoint iataCode={flight.destinationAirport.iataCode} size="lg" align="right" />
        </span>
      </div>

      <div className="-mt-1 flex items-start justify-between gap-4">
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
      </div>

      <BoxFooter>
        <Button color="indigo" as={Link} to={`/track/${flight.id}`} viewTransition>
          Manage
          <FaArrowRight className="ml-2 inline" aria-hidden="true" />
        </Button>
      </BoxFooter>
    </Container>
  );
}
