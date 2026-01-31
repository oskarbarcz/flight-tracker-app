"use client";

import { Badge, Button, Progress } from "flowbite-react";
import React from "react";
import { FaArrowRight, FaPlane } from "react-icons/fa";
import { FaCircleInfo, FaClock, FaPlaneDeparture } from "react-icons/fa6";
import { Link } from "react-router";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import Container from "~/components/shared/Layout/Container";
import ContainerEmptyState from "~/components/shared/Layout/ContainerEmptyState";
import ContainerTitle from "~/components/shared/Layout/ContainerTitle";
import { dateDiffToReadable } from "~/functions/time";
import {
  FilledSchedule,
  Flight,
  FlightStatus,
  statusToShortHumanForm,
} from "~/models";
import { useDateProgress } from "~/state/hooks/static/useDateProgress";

type CurrentFlightBoxProps = {
  flight: Flight;
};

export default function CurrentFlightBox({ flight }: CurrentFlightBoxProps) {
  const showDeparture = [
    FlightStatus.CheckedIn,
    FlightStatus.BoardingStarted,
    FlightStatus.BoardingFinished,
    FlightStatus.TaxiingOut,
  ].includes(flight.status);

  const showArrival = [
    FlightStatus.InCruise,
    FlightStatus.TaxiingIn,
    FlightStatus.OnBlock,
    FlightStatus.OffboardingStarted,
    FlightStatus.OffboardingFinished,
  ].includes(flight.status);

  const estimated = flight.timesheet.estimated as FilledSchedule;
  const timeReference = showArrival
    ? estimated.arrivalTime
    : estimated.takeoffTime;
  const timeRemaining = dateDiffToReadable(new Date(), timeReference);
  const timeProgress = useDateProgress(
    estimated.offBlockTime,
    estimated.onBlockTime,
  );

  return (
    <Container padding="condensed">
      <ContainerTitle>
        <div className="flex items-center justify-between gap-2">
          <span>Current flight</span>
          <span className="text-xs bg-indigo-100 dark:bg-indigo-900 uppercase text-indigo-500 dark:text-indigo-300 rounded-full py-1 px-2">
            {statusToShortHumanForm(flight.status)}
          </span>
        </div>
      </ContainerTitle>

      <article className="flex flex-row justify-between gap-3 mt-2 mb-6">
        <div>
          <span className="block text-indigo-500 text-4xl font-bold">
            {flight.flightNumber}
          </span>
          <span className="text-sm text-gray-500 mb-2">
            {flight.aircraft.fullName}&nbsp;&bull;{" "}
            {flight.aircraft.registration}
          </span>
        </div>

        {showDeparture && (
          <div className="text-right">
            <span className="text-right text-xl font-bold ">
              <FormattedIcaoTime
                date={flight.timesheet.scheduled.takeoffTime}
              />
            </span>
            <span className="block text-sm text-gray-500 mb-2 leading-5">
              Departure
            </span>
          </div>
        )}

        {showArrival && (
          <div className="text-right">
            <span className="text-right text-xl font-bold ">
              <FormattedIcaoTime
                date={flight.timesheet.scheduled.arrivalTime}
              />
            </span>
            <span className="block text-sm text-gray-500 mb-2 leading-5">
              Arrival
            </span>
          </div>
        )}
      </article>

      <article className="flex items-center justify-between mb-8 gap-3">
        <div className="basis-1/3">
          <span className="font-bold text-3xl">
            {flight.departureAirport.icaoCode}
          </span>
          <span className="block text-sm text-gray-500 leading-4">
            {flight.departureAirport.city}
          </span>
        </div>
        <div className="basis-1/3 flex gap-3 flex-col">
          <FaPlane className="text-gray-300 dark:text-gray-700 mx-auto text-xl rotate-270" />
          <Progress progress={timeProgress} color="indigo" size="sm" />
        </div>
        <div className="basis-1/3 text-right">
          <span className="font-bold text-3xl">
            {flight.destinationAirport.icaoCode}
          </span>
          <span className="block text-sm text-gray-500 leading-4">
            {flight.destinationAirport.city}
          </span>
        </div>
      </article>

      <div className="flex justify-between">
        <div className="flex items-center text-xs text-gray-500 py-2">
          <FaClock className="mr-1 inline"></FaClock>
          {showDeparture && "Time to departure: "}
          {showArrival && "Time remaining: "}
          {timeRemaining}
        </div>
        <Button
          color="indigo"
          as={Link}
          to={`track/${flight.id}`}
          replace
          viewTransition
        >
          Manage
          <FaArrowRight className="inline ml-2" aria-hidden="true" />
        </Button>
      </div>
    </Container>
  );
}
