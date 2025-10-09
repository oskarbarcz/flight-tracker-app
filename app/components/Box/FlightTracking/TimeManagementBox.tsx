"use client";

import React from "react";
import Container from "~/components/Layout/Container";
import {
  FaCircleInfo,
  FaClock,
  FaPlaneArrival,
  FaPlaneDeparture,
} from "react-icons/fa6";
import ContainerTitle from "~/components/Layout/ContainerTitle";
import { useTrackedFlight } from "~/state/contexts/tracked-flight.context";
import { AirportOnFlight, AirportOnFlightType } from "~/models";
import { FormattedTimezoneTime } from "~/components/Intrinsic/Date/FormattedTimezoneTime";
import { FormattedIcaoTime } from "~/components/Intrinsic/Date/FormattedIcaoTime";
import { FormattedIcaoDate } from "~/components/Intrinsic/Date/FormattedIcaoDate";
import { FormattedLocalTime } from "~/components/Intrinsic/Date/FormattedLocalTime";

export default function TimeManagementBox() {
  const { flight } = useTrackedFlight();

  if (!flight) {
    return (
      <Container padding="condensed">
        <ContainerTitle>Time management</ContainerTitle>
        <div className="min-h-[100px] flex items-center justify-center text-gray-500">
          <FaCircleInfo className="inline mr-2" />
          <span>Loading...</span>
        </div>
      </Container>
    );
  }

  const departureAirport = flight.airports.find(
    (airport) => airport.type === AirportOnFlightType.Departure,
  ) as AirportOnFlight;

  const arrivalAirport = flight.airports.find(
    (airport) => airport.type === AirportOnFlightType.Destination,
  ) as AirportOnFlight;

  return (
    <Container>
      <ContainerTitle>Time management</ContainerTitle>
      <div className="flex space-between items-center flex-wrap text-lg">
        <div className="w-1/2 shrink-0 mb-2">
          <span className="text-gray-500 text-sm">Zulu time</span>
          <p className="font-bold">
            <FormattedIcaoTime date={new Date()} />
          </p>
        </div>
        <div className="w-1/2 shrink-0 mb-2">
          <span className="text-gray-500 text-sm">Date</span>
          <p className="font-bold">
            <FormattedIcaoDate date={new Date()} />
          </p>
        </div>
        <div className="w-1/2 shrink-0 mb-2">
          <span className="text-gray-500 text-sm">Local time (now)</span>
          <p className="font-bold">
            <FormattedLocalTime date={new Date()} />
          </p>
        </div>
        <div className="w-1/2 shrink-0 mb-2">
          <p className="font-bold">
            <FaClock size="24" className="text-indigo-500 mr-4 inline-block" />
          </p>
        </div>
        <div className="w-1/2 shrink-0 mb-2">
          <span className="text-gray-500 text-sm">
            Departure ({departureAirport.iataCode})
          </span>
          <p className="font-bold text-lg">
            <FormattedTimezoneTime
              date={new Date()}
              timezone={departureAirport.timezone}
            />
          </p>
        </div>
        <div className="w-1/2 shrink-0 mb-2">
          <p className="font-bold">
            <FaPlaneDeparture
              size="32"
              className="text-indigo-500 mr-4 inline-block"
            />
          </p>
        </div>
        <div className="w-1/2 shrink-0 mb-2">
          <span className="text-gray-500 text-sm">
            Arrival ({arrivalAirport.iataCode})
          </span>
          <p className="font-bold text-lg">
            <FormattedTimezoneTime
              date={new Date()}
              timezone={arrivalAirport.timezone}
            />
          </p>
        </div>
        <div className="w-1/2 shrink-0 mb-2">
          <p className="font-bold">
            <FaPlaneArrival
              size="32"
              className="text-indigo-500 mr-4 inline-block"
            />
          </p>
        </div>
      </div>
    </Container>
  );
}
