import { Badge } from "flowbite-react";
import React from "react";
import { FaChevronRight, FaCircleInfo, FaClockRotateLeft, FaPlaneArrival, FaPlaneCircleCheck } from "react-icons/fa6";
import { Link } from "react-router";
import { AircraftRegistrationLink } from "~/features/aircraft/components/Aircraft/AircraftRegistrationLink";
import type { Flight } from "~/features/flight";
import { DetailLinkButton } from "~/shared/ui/Button/DetailLinkButton";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { AirportEndpoint } from "~/shared/ui/Display/AirportEndpoint";
import { StatBlock } from "~/shared/ui/Display/StatBlock";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

type Props = {
  flight: Flight | null;
};

function ArrivalStatusBadge({ delayMinutes }: { delayMinutes: number | null }) {
  if (delayMinutes === null) {
    return null;
  }
  if (delayMinutes <= 0) {
    return <Badge color="success">On time</Badge>;
  }
  return <Badge color="warning">+{delayMinutes}m late</Badge>;
}

export function LastFlightBox({ flight }: Props) {
  if (!flight) {
    return (
      <Container padding="condensed">
        <ContainerTitle icon={FaPlaneCircleCheck} title="Last flight" />
        <ContainerEmptyState>
          <FaCircleInfo className="inline mr-2" />
          <span>No last flight found.</span>
        </ContainerEmptyState>
      </Container>
    );
  }

  const scheduledArrival = flight.timesheet.scheduled.onBlockTime;
  const actualArrival = flight.timesheet.actual?.onBlockTime;
  const arrivalTime = actualArrival ?? scheduledArrival;
  const arrivalDelayMinutes = actualArrival
    ? Math.round((actualArrival.getTime() - scheduledArrival.getTime()) / 60_000)
    : null;

  return (
    <Container padding="condensed">
      <ContainerTitle
        icon={FaPlaneCircleCheck}
        title="Last flight"
        actions={<ArrivalStatusBadge delayMinutes={arrivalDelayMinutes} />}
      />

      <article className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="block font-mono text-3xl font-bold leading-none text-gray-900 dark:text-white">
            {flight.flightNumber}
          </span>
          <span className="mt-1.5 block truncate text-sm font-semibold text-gray-700 dark:text-gray-300">
            {flight.operator.shortName}
          </span>
          <span className="block truncate text-sm text-gray-500">
            <AircraftRegistrationLink aircraftId={flight.aircraft.id} registration={flight.aircraft.registration} /> ·{" "}
            {flight.aircraft.airframe.name}
          </span>
        </div>
        <StatBlock label="Arrival" align="right" value={<FormattedIcaoTime date={arrivalTime} />} />
      </article>

      <div className="flex flex-col gap-3">
        <article className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)] items-center gap-3">
          <AirportEndpoint iataCode={flight.departureAirport.iataCode} subtitle={flight.departureAirport.city} />
          <div className="flex items-center gap-1.5 text-gray-300 dark:text-gray-600">
            <span className="size-1.5 flex-none rounded-full bg-current" />
            <span className="flex-1 border-t border-dashed border-current" />
            <FaPlaneArrival className="flex-none text-gray-400 dark:text-gray-500" size={15} aria-hidden={true} />
            <span className="flex-1 border-t border-dashed border-current" />
            <span className="size-1.5 flex-none rounded-full bg-current" />
          </div>
          <AirportEndpoint
            iataCode={flight.destinationAirport.iataCode}
            subtitle={flight.destinationAirport.city}
            align="right"
          />
        </article>

        <div className="flex justify-end">
          <DetailLinkButton to={`/flight-history/${flight.id}`}>See flight details</DetailLinkButton>
        </div>
      </div>

      <Link
        to="/flight-history"
        viewTransition
        className="group -mx-4 -mb-4 flex items-center gap-3 border-t border-gray-100 px-4 py-3.5 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
      >
        <span className="flex size-8 flex-none items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-indigo-900 dark:group-hover:text-indigo-300">
          <FaClockRotateLeft size={14} aria-hidden={true} />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Flight history</span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">See all past flights</span>
        </span>
        <FaChevronRight
          size={13}
          className="ms-auto flex-none text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500 motion-reduce:transition-none dark:text-gray-500"
          aria-hidden={true}
        />
      </Link>
    </Container>
  );
}
