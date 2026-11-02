import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";
import { AircraftRegistrationLink } from "~/features/aircraft/components/Aircraft/AircraftRegistrationLink";
import type { Airport } from "~/features/airport";
import type { AirportLayout } from "~/features/airport/hooks/useAirportLayout";
import type { Flight } from "~/features/flight";
import { useCountdown } from "~/features/flight/components/Dashboard/Tracking/Progress/useCountdown";
import { GroundStopMap } from "~/features/flight/components/Map/Box/GroundStopMap";
import type { GroundStop } from "~/features/flight/hooks/useGroundStop";
import { isSameUtcDay } from "~/shared/lib/date";
import { padZero } from "~/shared/lib/time";
import { FormattedIcaoDate } from "~/shared/ui/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { dateToTimezoneTime } from "~/shared/ui/Date/FormattedTimezoneTime";
import { AirportEndpoint } from "~/shared/ui/Display/AirportEndpoint";
import { StatBlock } from "~/shared/ui/Display/StatBlock";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";

const SECONDS_PER_DAY = 86_400;
const LOCAL_TIME_REFRESH_MS = 15_000;

type Props = {
  groundStop: GroundStop;
  layout: AirportLayout;
  nextFlight: Flight | null;
  nextFlightFailed: boolean;
};

function utcOffset(date: Date, timezone: string): string {
  const offset = new Intl.DateTimeFormat("en-US", { timeZone: timezone, timeZoneName: "shortOffset" })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;

  return (offset ?? "GMT").replace("GMT", "UTC").replace("-", "−");
}

function LocalTime({ timezone }: { timezone: string }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), LOCAL_TIME_REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  return <StatBlock label="Local time" value={dateToTimezoneTime(now, timezone)} meta={utcOffset(now, timezone)} />;
}

function GroundClock({ since, event }: { since: Date; event: GroundStop["sinceEvent"] }) {
  const elapsed = Math.max(0, -useCountdown(since));
  const days = Math.floor(elapsed / SECONDS_PER_DAY);
  const hours = Math.floor((elapsed % SECONDS_PER_DAY) / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;
  const isToday = isSameUtcDay(since, new Date());

  return (
    <div className="flex flex-col items-end text-end">
      <span role="timer" className="whitespace-nowrap font-mono text-3xl font-bold leading-none tabular-nums">
        <span className="sr-only">
          {days} days {hours} hours {minutes} minutes
        </span>
        <span aria-hidden={true} className="text-gray-900 dark:text-white">
          {days > 0 && (
            <>
              {days}
              <span className="mx-1 text-sm font-normal text-gray-500 dark:text-gray-400">d</span>
            </>
          )}
          {padZero(hours)}:{padZero(minutes)}
          <span className="text-gray-500 dark:text-gray-400">:{padZero(seconds)}</span>
        </span>
      </span>
      <span className="mt-1 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
        On ground since {event.toLowerCase()}
      </span>
      <span className="whitespace-nowrap text-2xs text-gray-500 dark:text-gray-400">
        <FormattedIcaoTime date={since} />
        {!isToday && (
          <>
            {" · "}
            <FormattedIcaoDate date={since} />
          </>
        )}
      </span>
    </div>
  );
}

function NextStep({ airport, nextFlight }: { airport: Airport; nextFlight: Flight | null }) {
  if (!nextFlight) {
    return (
      <>
        Next step: <span className="font-semibold text-gray-900 dark:text-white">Wait for dispatch</span>
      </>
    );
  }

  if (nextFlight.departureAirport.id !== airport.id) {
    return (
      <>
        Next step:{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          Reposition to {nextFlight.departureAirport.iataCode} for {nextFlight.flightNumber}
        </span>
      </>
    );
  }

  return (
    <>
      Next flight:{" "}
      <span className="font-semibold text-gray-900 dark:text-white">
        {nextFlight.flightNumber} to {nextFlight.destinationAirport.iataCode}
      </span>
    </>
  );
}

export function GroundStopBox({ groundStop, layout, nextFlight, nextFlightFailed }: Props) {
  const { airport, since, sinceEvent, arrivedOn } = groundStop;
  const aircraft = arrivedOn ? { registration: arrivedOn.aircraft.registration, operator: arrivedOn.operator } : null;

  return (
    <Container
      padding="none"
      className="hidden sm:flex"
      header={<CardHeader title="Current flight" />}
      footer={
        <div className="flex items-center gap-3 px-3 py-2.5">
          {!nextFlightFailed && (
            <p className="min-w-0 text-sm text-gray-500 dark:text-gray-400">
              <NextStep airport={airport} nextFlight={nextFlight} />
            </p>
          )}
          <Button
            color="alternative"
            as={Link}
            to={`/airports-library/${airport.id}`}
            viewTransition
            className="ms-auto shrink-0"
          >
            Airport details
            <FaArrowRight className="ml-2 inline" aria-hidden="true" />
          </Button>
        </div>
      }
    >
      <div className="@container">
        <GroundStopMap
          airport={airport}
          layout={layout}
          aircraft={aircraft}
          className="h-40 border-b border-gray-200 dark:border-gray-800 @2xl:h-48"
        />

        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4 p-3 @2xl:grid @2xl:grid-cols-[auto_minmax(0,1fr)_auto] @2xl:gap-x-8 @2xl:[grid-template-areas:'identity_facts_time']">
          <div className="min-w-0 [grid-area:identity]">
            <AirportEndpoint
              iataCode={airport.iataCode}
              name={airport.name}
              subtitle={`${airport.icaoCode} · ${airport.city.name}`}
              size="lg"
            />
          </div>

          <div className="order-last grid w-full grid-cols-3 gap-3 [grid-area:facts] @2xl:w-auto @2xl:justify-self-center @2xl:gap-x-8">
            <LocalTime timezone={airport.timezone} />
            {layout.stand && (
              <StatBlock label="Stand" value={layout.stand.name} meta={layout.standTerminal?.fullName} />
            )}
            {arrivedOn && (
              <StatBlock
                label="Aircraft"
                value={
                  <AircraftRegistrationLink
                    aircraftId={arrivedOn.aircraft.id}
                    registration={arrivedOn.aircraft.registration}
                  />
                }
                meta={arrivedOn.aircraft.airframe.name}
              />
            )}
          </div>

          {since && (
            <div className="ms-auto [grid-area:time]">
              <GroundClock since={since} event={sinceEvent} />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
