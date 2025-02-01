"use client";

import {
  AirportOnFlight,
  AirportOnFlightType,
  Flight,
  FlightStatus,
} from "~/models";
import FlightProgressControl from "~/components/FlightProgressControl/FlightProgressControl";
import { Link } from "react-router";
import { SimpleTimeComponent } from "~/components/SimpleTimeComponent";
import { Button } from "flowbite-react";

type TrackFlightDashboardProps = {
  flight: Flight;
};

export function SimpleFlightDataDisplay({ flight }: TrackFlightDashboardProps) {
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
            <Link to={`/track/${flight.id}/check-in`}>
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
}
