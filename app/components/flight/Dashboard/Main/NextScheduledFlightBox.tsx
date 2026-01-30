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
import { Flight } from "~/models";

type Props = {
  flight: Flight | undefined;
  isCurrentFlight: boolean;
};

export default function NextScheduledFlightBox({
  flight,
  isCurrentFlight,
}: Props) {
  if (!flight) {
    return (
      <Container padding="condensed">
        <ContainerTitle>Next scheduled flight</ContainerTitle>
        <ContainerEmptyState>
          <FaCircleInfo className="inline mr-2" />
          <span>No upcoming flights.</span>
        </ContainerEmptyState>
      </Container>
    );
  }

  return (
    <Container padding="condensed">
      <ContainerTitle>Next scheduled flight</ContainerTitle>

      <article className="flex flex-row justify-between gap-3 mt-2 mb-6">
        <div className="w-full">
          <span className="block text-3xl font-bold">
            {flight.flightNumber}
          </span>
          <span className=" text-gray-500 mb-2">
            {flight.aircraft.fullName}
          </span>
        </div>
        <div className="w-full text-right ">
          <span className="text-right text-xl font-bold ">
            <FormattedIcaoTime date={flight.timesheet.scheduled.takeoffTime} />
          </span>
          <span className="block text-sm text-gray-500 mb-2 leading-5">
            Departure
          </span>
        </div>
      </article>

      <article className="flex items-center bg-gray-50 dark:bg-gray-950 justify-evenly border border-dashed border-gray-200 dark:border-gray-800 mb-6 rounded-xl p-3">
        <div className="basis-64 text-center p-3">
          <span className="font-bold text-2xl">
            {flight.departureAirport.icaoCode}
          </span>
          <span className="block text-sm text-gray-500 leading-4">
            {flight.departureAirport.city}
          </span>
        </div>
        <FaPlaneDeparture className="text-gray-300 text-3xl" />
        <div className="basis-64 text-center p-3">
          <span className="font-bold text-2xl">
            {flight.destinationAirport.icaoCode}
          </span>
          <span className="block text-sm text-gray-500 leading-4">
            {flight.destinationAirport.city}
          </span>
        </div>
      </article>

      <div className="flex justify-end">
        <Button
          color={isCurrentFlight ? "alternative" : "indigo"}
          size={isCurrentFlight ? "xs" : undefined}
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
