import { Button } from "flowbite-react";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";
import { AdsbProvider } from "~/features/adsb/hooks/useAdsbData";
import type { Flight } from "~/features/flight";
import { DelayBadge } from "~/features/flight/components/Dashboard/Main/Box/DelayBadge";
import { RouteGauge } from "~/features/flight/components/Dashboard/Main/Box/RouteGauge";
import { LifecycleTrack } from "~/features/flight/components/Dashboard/Tracking/Progress/LifecycleTrack";
import { useCountdown } from "~/features/flight/components/Dashboard/Tracking/Progress/useCountdown";
import { FlightIdentity } from "~/features/flight/components/FlightIdentity";
import { CompactFlightMap } from "~/features/flight/components/Map/Box/CompactFlightMap";
import { useLiveFlightPath } from "~/features/flight/hooks/useLiveFlightPath";
import {
  type BlockEvent,
  blockEventLabel,
  blockReference,
  nextAction,
  nextActionCaption,
  resolveBlockEvents,
} from "~/features/flight/lib/blockEvents";
import { lifecycleSteps } from "~/features/flight/lib/lifecycle";
import { toHuman } from "~/i18n/translate";
import { isSameUtcDay } from "~/shared/lib/date";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

type Props = {
  flight: Flight;
};

function NextActionCaption({ event }: { event: BlockEvent }) {
  useCountdown(event.time);

  return <span className="text-xs text-gray-500 dark:text-gray-400">{nextActionCaption(event, new Date())}</span>;
}

function ReferenceTime({ event }: { event: BlockEvent }) {
  const isToday = isSameUtcDay(event.time, new Date());

  return (
    <div className="flex flex-col items-end text-end">
      <span className="whitespace-nowrap text-3xl font-bold leading-none tabular-nums text-gray-900 dark:text-white">
        <FormattedIcaoTime date={event.time} />
      </span>
      <span className="whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
        {blockEventLabel(event)}
        {!isToday && (
          <>
            {" · "}
            <FormattedIcaoDate date={event.time} />
          </>
        )}
      </span>
      <div className="mt-2 empty:hidden">
        <DelayBadge minutes={event.delayMinutes} />
      </div>
    </div>
  );
}

export function CurrentFlightBox({ flight }: Props) {
  return (
    <AdsbProvider>
      <CurrentFlightBoxContent flight={flight} />
    </AdsbProvider>
  );
}

function CurrentFlightBoxContent({ flight }: Props) {
  const path = useLiveFlightPath(flight);
  const blockEvents = resolveBlockEvents(flight.timesheet);
  const upcoming = nextAction(blockEvents);
  const nextStep = toHuman.flight.status.next(flight.status, flight.serviceType);
  const steps = lifecycleSteps(flight.status, flight.timesheet, []);

  return (
    <Container
      padding="none"
      header={<CardHeader title="Current flight" />}
      footer={
        <div className="flex items-center gap-3 px-3 py-2.5">
          {nextStep !== null && (
            <p className="min-w-0 text-sm text-gray-500 dark:text-gray-400">
              Next step: <span className="font-semibold text-gray-900 dark:text-white">{nextStep}</span>
            </p>
          )}
          <Button color="indigo" as={Link} to={`/track/${flight.id}`} viewTransition className="ms-auto shrink-0">
            Manage
            <FaArrowRight className="ml-2 inline" aria-hidden="true" />
          </Button>
        </div>
      }
    >
      <div className="@container">
        <CompactFlightMap
          flight={flight}
          path={path}
          className="h-40 border-b border-gray-200 dark:border-gray-800 @2xl:h-48"
        />

        <div className="flex flex-col gap-4 p-3">
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4 @2xl:grid @2xl:grid-cols-[auto_minmax(0,1fr)_auto] @2xl:gap-x-8 @2xl:[grid-template-areas:'identity_route_time']">
            <div className="min-w-0 [grid-area:identity]">
              <FlightIdentity
                operator={flight.operator}
                flightNumber={flight.flightNumber}
                aircraftId={flight.aircraft.id}
                registration={flight.aircraft.registration}
              />
            </div>
            <RouteGauge flight={flight} path={path} className="order-last w-full [grid-area:route] @2xl:w-auto" />
            <div className="ms-auto [grid-area:time]">
              <ReferenceTime event={blockReference(blockEvents)} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <p className="text-base font-bold text-gray-900 dark:text-white">
                {toHuman.flight.status.phase(flight.status, flight.serviceType)}
              </p>
              {upcoming !== null && <NextActionCaption event={upcoming} />}
            </div>
            <LifecycleTrack steps={steps} serviceType={flight.serviceType} compact />
          </div>
        </div>
      </div>
    </Container>
  );
}
