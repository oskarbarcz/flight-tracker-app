"use client";

import React, { useState } from "react";
import { AirportOnFlight, FlightStatus, Flight, Timesheet } from "~/models";
import { Button } from "flowbite-react";
import { FlightService } from "~/state/services/flight.service";

type TrackFlightDashboardProps = {
  flight: Flight;
};

export const TimeComponent = ({ timesheet }: { timesheet: Timesheet }) => {
  return (
    <div>
      <p>
        <strong>off-block: </strong>
        {timesheet.offBlockTime && <span>{timesheet.offBlockTime}</span>}
      </p>
      <p>
        <strong>takeoff: </strong>
        {timesheet.takeoffTime && <span>{timesheet.takeoffTime}</span>}
      </p>
      <p>
        <strong>arrival: </strong>
        {timesheet.arrivalTime && <span>{timesheet.arrivalTime}</span>}
      </p>
      <p>
        <strong>on-block: </strong>
        {timesheet.onBlockTime && <span>{timesheet.onBlockTime}</span>}
      </p>
    </div>
  );
};

export const SimpleFlightDataDisplay = ({
  flight,
}: TrackFlightDashboardProps) => {
  const departure = flight.airports.find(
    (a) => a.type === "departure",
  ) as AirportOnFlight;
  const destination = flight.airports.find(
    (a) => a.type === "destination",
  ) as AirportOnFlight;
  const alternates = flight.airports.filter(
    (a) => a.type in ["destination_alternate", "etops_alternate"],
  ) as AirportOnFlight[];

  type State = {
    status: FlightStatus | undefined;
  };
  const [status, setStatus] = useState<State>({ status: flight.status });
  const onClick = () => {
    if (!status.status) {
      return;
    }

    const nextStatus = FlightService.getNextAction(status.status);

    if (!nextStatus) {
      return;
    }

    setStatus({ status: nextStatus });
  };

  return (
    <div className="mt-4 flex">
      <div className="mr-6">
        <h2 className="font-bold">Flight info</h2>
        <p>
          <strong>Flight number:</strong> {flight.flightNumber} <br />
          From: [{departure.icaoCode}] {departure.name} <br />
          To: [{destination.icaoCode}] {destination.name} <br />
          Alternates:{" "}
          {alternates
            .map((a) => `[${a.icaoCode}] ${a.name}`)
            .join(", ")} <br />
          Status: {status.status} <br />
          {status.status !== "closed" && (
            <Button onClick={onClick}>Flight next step</Button>
          )}
        </p>
      </div>
      <div className="mr-6">
        <h2 className="font-bold">Timesheet</h2>
        {flight.timesheet.scheduled && (
          <div>
            <h3>Schedule</h3>
            <TimeComponent timesheet={flight.timesheet.scheduled} />
          </div>
        )}
        {flight.timesheet.estimated && (
          <div>
            <h3>Estimation</h3>
            <TimeComponent timesheet={flight.timesheet.estimated} />
          </div>
        )}
        {flight.timesheet.actual && (
          <div>
            <h3>Actual</h3>
            <TimeComponent timesheet={flight.timesheet.actual} />
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
