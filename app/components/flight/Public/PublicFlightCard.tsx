"use client";

import { Badge, Button } from "flowbite-react";
import React from "react";
import { FaArrowRight, FaPlane } from "react-icons/fa";
import { Link } from "react-router";
import { FormattedIcaoDate } from "~/components/shared/Date/FormattedIcaoDate";
import { FormattedIcaoTime } from "~/components/shared/Date/FormattedIcaoTime";
import { Flight } from "~/models";
import { statusToShortHumanForm } from "~/models/translate/flight.translate";

type Props = {
  flight: Flight;
};

export default function PublicFlightCard({ flight }: Props) {
  return (
    <Link
      to={`/live-tracking/${flight.id}`}
      className="block rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 md:p-6 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-4 md:gap-6">
        {/* Flight Number & Operator */}
        <div className="flex-shrink-0 w-32">
          <h3 className="text-xl md:text-2xl font-bold text-indigo-500 dark:text-indigo-400">
            {flight.flightNumberWithoutSpaces}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {flight.operator.shortName}
          </p>
        </div>

        {/* Route */}
        <div className="flex items-center gap-2 md:gap-3 flex-1">
          <div className="flex-shrink-0">
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {flight.departureAirport.iataCode}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
              {flight.departureAirport.city}
            </p>
          </div>

          <FaPlane className="text-gray-300 dark:text-gray-700 text-sm md:text-base rotate-315 flex-shrink-0" />

          <div className="flex-shrink-0">
            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {flight.destinationAirport.iataCode}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
              {flight.destinationAirport.city}
            </p>
          </div>
        </div>

        {/* Departure Time */}
        <div className="hidden md:block flex-shrink-0 w-40">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 text-right">
            Departure (UTC)
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white text-right">
            <FormattedIcaoDate date={flight.timesheet.scheduled.takeoffTime} />
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white text-right">
            <FormattedIcaoTime date={flight.timesheet.scheduled.takeoffTime} />
          </p>
        </div>

        {/* Aircraft */}
        <div className="hidden lg:block flex-shrink-0 text-right w-32">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Aircraft
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {flight.aircraft.registration}
          </p>
        </div>

        {/* Status Badge */}
        <div className="hidden md:flex flex-shrink-0 items-center justify-end w-28">
          <Badge color="indigo" size="sm">
            {statusToShortHumanForm(flight.status)}
          </Badge>
        </div>

        {/* Track Button */}
        <div className="flex-shrink-0">
          <Button color="gray" outline size="sm">
            Track
            <FaArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
