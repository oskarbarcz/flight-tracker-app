"use client";

import { AirportOnFlight, AirportOnFlightType, Flight } from "~/models";
import { Button, Modal } from "flowbite-react";
import { formatDate } from "~/functions/time";
import React from "react";

type ReleaseFlightModalProps = {
  flight: Flight;
  release: (flightId: string) => void;
  cancel: () => void;
};

export default function ReleaseFlightModal({
  flight,
  release,
  cancel,
}: ReleaseFlightModalProps) {
  const departure = flight.airports.find(
    (airport) => airport.type === AirportOnFlightType.Departure,
  ) as AirportOnFlight;
  const destination = flight.airports.find(
    (airport) => airport.type === AirportOnFlightType.Destination,
  ) as AirportOnFlight;

  return (
    <Modal show onClose={cancel}>
      <Modal.Header>Release flight</Modal.Header>
      <Modal.Body className="text-gray-900 dark:text-gray-100">
        <p>
          You are going to release flight{" "}
          <span className="font-bold">{flight.flightNumber} </span>
          from{" "}
          <span className="font-bold">
            {departure.city} ({departure.iataCode}){" "}
          </span>
          to{" "}
          <span className="font-bold">
            {destination.city} ({destination.iataCode})
          </span>
          , departing at{" "}
          <span className="font-bold">
            {formatDate(new Date(flight.timesheet.scheduled.takeoffTime))}
          </span>
          .
        </p>
        <p className="my-4">
          After you release the flight, the pilot will be able to start the
          flight plan. <span className="font-bold">Removing a flight </span>
          and
          <span className="font-bold"> changing the schedule </span>
          won't be available anymore.
        </p>
        <p className="my-4">Are you sure to proceed?</p>
      </Modal.Body>
      <Modal.Footer>
        <div className="ms-auto flex gap-2">
          <Button color="gray" onClick={cancel}>
            Back
          </Button>
          <Button onClick={() => release(flight.id)}>
            Release flight {flight.flightNumber}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
