"use client";

import { AirportOnFlight, AirportOnFlightType, Flight } from "~/models";
import { SimpleTimeComponent } from "~/components/SimpleTimeComponent";

type TrackFlightDashboardProps = {
  flight: Flight;
};

export function AllDisplayBox({ flight }: TrackFlightDashboardProps) {
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
    <div className="row-span-3 rounded-lg bg-gray-100 p-6 shadow dark:bg-gray-800">
      <div>
        <div>
          <h2 className="font-bold">Flight info</h2>
          <p>
            <strong>Flight number:</strong> {flight.flightNumber} <br />
            From: [{departure.icaoCode}] {departure.name} <br />
            To: [{destination.icaoCode}] {destination.name} <br />
            Alternates:
            {alternates.map((a) => `[${a.icaoCode}] ${a.name}`).join(", ")}{" "}
            <br />
          </p>
        </div>
        <div>
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
          <h2 className="font-bold">Aircraft</h2>[{flight.aircraft.registration}
          ] {flight.aircraft.shortName}
          <br />
          <strong>Full name:</strong> {flight.aircraft.fullName}
          <br />
          <strong>Livery:</strong> {flight.aircraft.livery}
          <br />
          <strong>SELCAL:</strong> {flight.aircraft.selcal}
          <br />
        </div>
      </div>
    </div>
  );
}
