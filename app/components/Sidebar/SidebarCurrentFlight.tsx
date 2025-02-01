"use client";

import React, { useCallback, useEffect } from "react";
import {
  AirportOnFlight,
  AirportOnFlightType,
  CheckedInFlightTimesheet,
  Flight,
} from "~/models";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "react-router";
import { FaArrowDown } from "react-icons/fa";
import { useFlight } from "~/state/hooks/useFlight";

type SidebarCurrentFlightProps = {
  flightId: string;
  isCollapsed: boolean;
};

function calculateTimeToGo(arrival: Date): string {
  dayjs.extend(relativeTime);
  return dayjs().to(arrival, true);
}

export default function SidebarCurrentFlight({
  flightId,
  isCollapsed,
}: SidebarCurrentFlightProps) {
  const { flight, loadFlight } = useFlight();
  const [timeRemaining, setTimeRemaining] = React.useState<string | null>(null);

  const handleTimeUpdate = useCallback((flight: Flight) => {
    const timesheet = flight.timesheet as CheckedInFlightTimesheet;
    const timeRemaining = calculateTimeToGo(
      new Date(timesheet.estimated.arrivalTime),
    );
    setTimeRemaining(timeRemaining);
  }, []);

  useEffect(() => {
    loadFlight(flightId).then(handleTimeUpdate);
  }, [flightId, loadFlight, handleTimeUpdate]);

  if (!flight) {
    return <div>Loading...</div>;
  }

  setInterval(() => handleTimeUpdate(flight), 1000 * 60);

  const departureAirport = flight.airports.find(
    (airport) => airport.type === AirportOnFlightType.Departure,
  ) as AirportOnFlight;

  const destinationAirport = flight.airports.find(
    (airport) => airport.type === AirportOnFlightType.Destination,
  ) as AirportOnFlight;

  if (isCollapsed) {
    return (
      <Link
        to={`/track/${flight.id}`}
        replace
        viewTransition
        className="block w-full rounded-lg bg-gray-200 p-2 text-start dark:bg-gray-700"
      >
        <span className="text-xs">
          <span className="block text-center font-bold">
            {departureAirport.iataCode}
          </span>
          <FaArrowDown className="mx-auto my-1 block" />
          <span className="block text-center font-bold">
            {destinationAirport.iataCode}
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link
      to={`/track/${flight.id}`}
      replace
      viewTransition
      className="block w-full rounded-lg bg-gray-200 p-2 text-start dark:bg-gray-700"
    >
      <span className="block text-xs">
        <span className="font-bold">{flight.flightNumber}</span>
        {" to "}
        <span className="font-bold">{destinationAirport.city}</span>
      </span>

      <span className="block text-xs">est. arrival in {timeRemaining}</span>
    </Link>
  );
}
