"use client";

import React, { useEffect, useRef } from "react";
import {
  AirportOnFlight,
  AirportOnFlightType,
  FlightStatus,
  isFlightAvailableForCheckIn,
} from "~/models";
import FlightProgressControl from "~/components/FlightProgressControl/FlightProgressControl";
import { useFlight } from "~/state/hooks/useFlight";
import { Link, Navigate } from "react-router";
import { SimpleTimeComponent } from "~/components/SimpleTimeComponent";
import { Button } from "flowbite-react";

type TrackFlightDashboardProps = {
  flightId: string;
};

export const SimpleFlightDataDisplay = ({
  flightId,
}: TrackFlightDashboardProps) => {
  const { flight, loadFlight } = useFlight();
  const loadFlightRef = useRef(loadFlight);

  useEffect(() => {
    loadFlightRef.current(flightId).then((flight) => {
      if (flight === null) {
        return;
      }

      if (isFlightAvailableForCheckIn(flight.status)) {
        return <Navigate to={`/track/${flight.id}/check-in`} replace={true} />;
      }
    });
  }, [flightId, loadFlightRef]);

  if (!flight) {
    return <div>Loading...</div>;
  }

  const departure = flight.airports.find(
    (a) => a.type === AirportOnFlightType.Departure,
  ) as AirportOnFlight;
  const destination = flight.airports.find(
    (a) => a.type === AirportOnFlightType.Destination,
  ) as AirportOnFlight;
  const alternates = flight.airports.filter(
    (a) =>
      a.type in
      [
        AirportOnFlightType.DestinationAlternate,
        AirportOnFlightType.EtopsAlternate,
      ],
  ) as AirportOnFlight[];

  return (
    <div className="mt-4 flex">
      <div className="mr-6">
        <h2 className="font-bold">Flight info</h2>
        <p>
          <strong>Flight number:</strong> {flight.flightNumber} <br />
          From: [{departure.icaoCode}] {departure.name} <br />
          To: [{destination.icaoCode}] {destination.name} <br />
          Alternates:
          {alternates
            .map((a) => `[${a.icaoCode}] ${a.name}`)
            .join(", ")} <br />
          <FlightProgressControl flightId={flight.id} status={flight.status} />
          {flight.status === FlightStatus.Ready && (
            <Link to={`track/${flight.id}/check-in`}>
              <Button className="mt-2">Go to flight check-in</Button>
            </Link>
          )}
        </p>
      </div>
      <div className="mr-6">
        <h2 className="font-bold">Timesheet</h2>
        {flight.timesheet.scheduled && (
          <div>
            <h3>Schedule</h3>
            <SimpleTimeComponent timesheet={flight.timesheet.scheduled} />
          </div>
        )}
        {flight.timesheet.estimated && (
          <div>
            <h3>Estimation</h3>
            <SimpleTimeComponent timesheet={flight.timesheet.estimated} />
          </div>
        )}
        {flight.timesheet.actual && (
          <div>
            <h3>Actual</h3>
            <SimpleTimeComponent timesheet={flight.timesheet.actual} />
          </div>
        )}
      </div>
      <div>
        <h2 className="font-bold">Aircraft</h2>[{flight.aircraft.registration}]{" "}
        {flight.aircraft.shortName}
        <br />
        <strong>Full name:</strong> {flight.aircraft.fullName}
        <br />
        <strong>Livery:</strong> {flight.aircraft.livery}
        <br />
        <strong>SELCAL:</strong> {flight.aircraft.selcal}
        <br />
      </div>
    </div>
  );
};
