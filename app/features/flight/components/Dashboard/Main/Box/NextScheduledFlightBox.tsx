import React from "react";
import { FaCircleInfo, FaPlaneDeparture } from "react-icons/fa6";
import type { Flight } from "~/features/flight";
import { FlightIdentity } from "~/features/flight/components/FlightIdentity";
import { DetailLinkButton } from "~/shared/ui/Button/DetailLinkButton";
import { FormattedIcaoTime } from "~/shared/ui/Date/FormattedIcaoTime";
import { AirportEndpoint } from "~/shared/ui/Display/AirportEndpoint";
import { StatBlock } from "~/shared/ui/Display/StatBlock";
import { CardHeader } from "~/shared/ui/Layout/CardHeader";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";

type Props = {
  flight: Flight | undefined;
};

export function NextScheduledFlightBox({ flight }: Props) {
  if (!flight) {
    return (
      <Container padding="condensed" header={<CardHeader title="Next scheduled flight" />}>
        <ContainerEmptyState>
          <FaCircleInfo className="inline mr-2" />
          <span>No upcoming flights.</span>
        </ContainerEmptyState>
      </Container>
    );
  }

  return (
    <Container padding="condensed" header={<CardHeader title="Next scheduled flight" />}>
      <article className="flex items-start justify-between gap-3">
        <FlightIdentity
          operator={flight.operator}
          flightNumber={flight.flightNumber}
          aircraftId={flight.aircraft.id}
          registration={flight.aircraft.registration}
          size="md"
        />
        <StatBlock
          label="Departure"
          align="right"
          value={<FormattedIcaoTime date={flight.timesheet.scheduled.takeoffTime} />}
        />
      </article>

      <div className="flex flex-col gap-3">
        <article className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1fr)] items-center gap-3">
          <AirportEndpoint iataCode={flight.departureAirport.iataCode} subtitle={flight.departureAirport.city.name} />
          <div className="flex items-center gap-1.5 text-gray-300 dark:text-gray-600">
            <span className="size-1.5 flex-none rounded-full bg-current" />
            <span className="flex-1 border-t border-dashed border-current" />
            <FaPlaneDeparture className="flex-none text-gray-400 dark:text-gray-500" size={15} aria-hidden={true} />
            <span className="flex-1 border-t border-dashed border-current" />
            <span className="size-1.5 flex-none rounded-full bg-current" />
          </div>
          <AirportEndpoint
            iataCode={flight.destinationAirport.iataCode}
            subtitle={flight.destinationAirport.city.name}
            align="right"
          />
        </article>

        <div className="flex justify-end">
          <DetailLinkButton to={`/track/${flight.id}`}>See flight details</DetailLinkButton>
        </div>
      </div>
    </Container>
  );
}
