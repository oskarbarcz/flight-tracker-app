import React from "react";
import { FaCircleInfo, FaClockRotateLeft, FaPlaneArrival, FaTriangleExclamation } from "react-icons/fa6";
import type { Flight } from "~/features/flight";
import { BlockTimeStat } from "~/features/flight/components/Dashboard/Main/Box/BlockTimeStat";
import { FlightIdentity } from "~/features/flight/components/FlightIdentity";
import { onBlockEvent, resolveBlockEvents } from "~/features/flight/lib/blockEvents";
import { DetailLinkButton } from "~/shared/ui/Button/DetailLinkButton";
import { AirportEndpoint } from "~/shared/ui/Display/AirportEndpoint";
import { CardFooterLink } from "~/shared/ui/Layout/CardFooterLink";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";
import { TilePlaceholder } from "~/shared/ui/Layout/TilePlaceholder";

type Props = {
  flight: Flight | null;
  failed: boolean;
};

export function LastFlightBox({ flight, failed }: Props) {
  const footer = (
    <CardFooterLink
      to="/flight-history"
      icon={FaClockRotateLeft}
      title="Flight history"
      description="See all past flights"
    />
  );

  if (failed) {
    return (
      <Container padding="condensed" header={<CardHeader title="Last flight" />} footer={footer}>
        <TilePlaceholder
          icon={FaTriangleExclamation}
          hint="Your last flight could not be loaded. Reload the page to try again."
        />
      </Container>
    );
  }

  if (!flight) {
    return (
      <Container padding="condensed" header={<CardHeader title="Last flight" />}>
        <ContainerEmptyState>
          <FaCircleInfo className="inline mr-2" aria-hidden={true} />
          <span>No last flight found.</span>
        </ContainerEmptyState>
      </Container>
    );
  }

  const onBlock = onBlockEvent(resolveBlockEvents(flight.timesheet));

  return (
    <Container footer={footer} padding="condensed" header={<CardHeader title="Last flight" />}>
      <div className="flex items-start justify-between gap-3">
        <FlightIdentity
          operator={flight.operator}
          flightNumber={flight.flightNumber}
          aircraftId={flight.aircraft.id}
          registration={flight.aircraft.registration}
          size="md"
        />
        <BlockTimeStat event={onBlock} />
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)] items-center gap-3">
          <AirportEndpoint iataCode={flight.departureAirport.iataCode} subtitle={flight.departureAirport.city.name} />
          <div className="flex items-center gap-1.5 text-gray-300 dark:text-gray-600">
            <span className="size-1.5 flex-none rounded-full bg-current" />
            <span className="flex-1 border-t border-dashed border-current" />
            <FaPlaneArrival className="flex-none text-gray-500 dark:text-gray-400" size={15} aria-hidden={true} />
            <span className="flex-1 border-t border-dashed border-current" />
            <span className="size-1.5 flex-none rounded-full bg-current" />
          </div>
          <AirportEndpoint
            iataCode={flight.destinationAirport.iataCode}
            subtitle={flight.destinationAirport.city.name}
            align="right"
          />
        </div>

        <div className="flex justify-end">
          <DetailLinkButton to={`/flight-history/${flight.id}`}>See flight details</DetailLinkButton>
        </div>
      </div>
    </Container>
  );
}
