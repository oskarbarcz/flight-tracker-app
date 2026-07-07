import { Button } from "flowbite-react";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaCircleInfo, FaPlaneCircleCheck } from "react-icons/fa6";
import { Link } from "react-router";
import { AircraftRegistrationLink } from "~/features/aircraft/components/Aircraft/AircraftRegistrationLink";
import type { Flight } from "~/features/flight";
import { dateDiffToReadable } from "~/shared/lib/time";
import { Container } from "~/shared/ui/Layout/Container";
import { ContainerEmptyState } from "~/shared/ui/Layout/ContainerEmptyState";
import { ContainerTitle } from "~/shared/ui/Layout/ContainerTitle";

type Props = {
  flight: Flight | null;
};

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

  return (
    <Container padding="condensed">
      <ContainerTitle icon={FaPlaneCircleCheck} title="Last flight" />

      <article className="mt-2 rounded-xl">
        <div className="w-1/2 mb-2 inline-block">
          <span className="font-bold text-sm uppercase text-gray-500">Route</span>
          <span className="flex text-lg font-bold items-center gap-1">
            {flight.departureAirport.icaoCode}
            <FaArrowRight className="text-gray-500 text-xs" />
            {flight.destinationAirport.icaoCode}
          </span>
        </div>
        <div className="w-1/2 inline-block">
          <span className="font-bold text-sm uppercase text-gray-500">Airframe</span>
          <span className="flex text-lg font-bold items-center gap-1">
            <AircraftRegistrationLink aircraftId={flight.aircraft.id} registration={flight.aircraft.registration} /> (
            {flight.aircraft.airframe.type})
          </span>
        </div>
        <div className="w-1/2 inline-block">
          <span className="font-bold text-sm uppercase text-gray-500">Block time</span>
          <span className="flex text-lg font-bold items-center gap-1">
            {dateDiffToReadable(
              flight.timesheet.actual?.offBlockTime as Date,
              flight.timesheet.actual?.onBlockTime as Date,
            )}
          </span>
        </div>
        <div className="w-1/2 inline-block">
          <span className="font-bold text-sm uppercase text-gray-500">Arrival status</span>
          <span className="flex text-lg text-green-500 font-bold items-center gap-1">On time</span>
        </div>
      </article>

      <div className="flex justify-end gap-2 border-t border-dashed border-gray-200 pt-4 dark:border-gray-800">
        <Button color="alternative" size="xs" as={Link} to={`/flight-history/${flight.id}`} viewTransition>
          See details
          <FaArrowRight className="inline ml-2" aria-hidden="true" />
        </Button>
        <Button color="alternative" size="xs" as={Link} to="/flight-history" viewTransition>
          See flight history
          <FaArrowRight className="inline ml-2" aria-hidden="true" />
        </Button>
      </div>
    </Container>
  );
}
