"use client";

import { Button } from "flowbite-react";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaCircleInfo, FaPlaneDeparture } from "react-icons/fa6";
import { Link } from "react-router";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import Container from "~/components/shared/Layout/Container";
import ContainerEmptyState from "~/components/shared/Layout/ContainerEmptyState";
import ContainerTitle from "~/components/shared/Layout/ContainerTitle";
import { dateDiffToReadable } from "~/functions/time";
import { Flight } from "~/models";

type Props = {
  flight: Flight | null;
};

export default function LastFlightBox({ flight }: Props) {
  if (!flight) {
    return (
      <Container padding="condensed">
        <ContainerTitle>Last flight</ContainerTitle>
        <ContainerEmptyState>
          <FaCircleInfo className="inline mr-2" />
          <span>No last flight found.</span>
        </ContainerEmptyState>
      </Container>
    );
  }

  return (
    <Container padding="condensed">
      <ContainerTitle>Last flight</ContainerTitle>

      <article className=" mt-2 mb-6 rounded-xl">
        <div className="w-1/2 mb-2 inline-block">
          <span className="font-bold text-sm uppercase text-gray-500">
            Route
          </span>
          <span className="flex text-lg font-bold items-center gap-1">
            {flight.departureAirport.icaoCode}
            <FaArrowRight className="text-gray-500 text-xs" />
            {flight.destinationAirport.icaoCode}
          </span>
        </div>
        <div className="w-1/2 inline-block">
          <span className="font-bold text-sm uppercase text-gray-500">
            Airframe
          </span>
          <span className="flex text-lg font-bold items-center gap-1">
            {flight.aircraft.registration} ({flight.aircraft.icaoCode})
          </span>
        </div>
        <div className="w-1/2 inline-block">
          <span className="font-bold text-sm uppercase text-gray-500">
            Block time
          </span>
          <span className="flex text-lg font-bold items-center gap-1">
            {dateDiffToReadable(
              flight.timesheet.actual?.offBlockTime as Date,
              flight.timesheet.actual?.onBlockTime as Date,
            )}
          </span>
        </div>
        <div className="w-1/2 inline-block">
          <span className="font-bold text-sm uppercase text-gray-500">
            Arrival status
          </span>
          <span className="flex text-lg text-green-500 font-bold items-center gap-1">
            On time
          </span>
        </div>
      </article>

      <div className="flex justify-end">
        <Button
          color="alternative"
          size="xs"
          as={Link}
          to={`track/${flight.id}`}
          replace
          viewTransition
        >
          See details
          <FaArrowRight className="inline ml-2" aria-hidden="true" />
        </Button>
      </div>
    </Container>
  );
}
