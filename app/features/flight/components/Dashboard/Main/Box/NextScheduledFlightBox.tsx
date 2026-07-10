import React from "react";
import { FaCircleInfo, FaPlaneDeparture } from "react-icons/fa6";
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
  flight: Flight | undefined;
};

export function NextScheduledFlightBox({ flight }: Props) {
  if (!flight) {
    return (
      <Container padding="condensed">
        <ContainerTitle icon={FaPlaneDeparture} title="Next scheduled flight" />
        <ContainerEmptyState>
          <FaCircleInfo className="inline mr-2" />
          <span>No upcoming flights.</span>
        </ContainerEmptyState>
      </Container>
    );
  }

  return (
    <Container padding="condensed">
      <ContainerTitle icon={FaPlaneDeparture} title="Next scheduled flight" />

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
        <StatBlock
          label="Departure"
          align="right"
          value={<FormattedIcaoTime date={flight.timesheet.scheduled.takeoffTime} />}
        />
      </article>

      <div className="flex flex-col gap-3">
        <article className="grid grid-cols-[1fr_1.3fr_1fr] items-center gap-3">
          <AirportEndpoint iataCode={flight.departureAirport.iataCode} subtitle={flight.departureAirport.city} />
          <div className="flex items-center gap-1.5 text-gray-300 dark:text-gray-600">
            <span className="size-1.5 flex-none rounded-full bg-current" />
            <span className="flex-1 border-t border-dashed border-current" />
            <FaPlaneDeparture className="flex-none text-gray-400 dark:text-gray-500" size={15} aria-hidden={true} />
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
          <DetailLinkButton to={`/track/${flight.id}`}>See flight details</DetailLinkButton>
        </div>
      </div>
    </Container>
  );
}
