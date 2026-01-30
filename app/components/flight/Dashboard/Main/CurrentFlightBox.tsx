"use client";

import { Badge, Button } from "flowbite-react";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { Link } from "react-router";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import Container from "~/components/shared/Layout/Container";
import ContainerEmptyState from "~/components/shared/Layout/ContainerEmptyState";
import ContainerTitle from "~/components/shared/Layout/ContainerTitle";
import { Flight, FlightStatus, statusToShortHumanForm } from "~/models";

type CurrentFlightBoxProps = {
  flight: Flight | null;
};

export default function CurrentFlightBox({ flight }: CurrentFlightBoxProps) {
  if (!flight) {
    return (
      <Container padding="condensed">
        <ContainerTitle>Current flight</ContainerTitle>
        <ContainerEmptyState>
          <FaCircleInfo className="inline mr-2" />
          <span>No ongoing flight now.</span>
        </ContainerEmptyState>
      </Container>
    );
  }

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

      <div className="flex justify-end">
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
