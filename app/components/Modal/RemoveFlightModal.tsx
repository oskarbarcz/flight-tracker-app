"use client";

import { AirportOnFlight, AirportOnFlightType, Flight } from "~/models";
import { Button, Modal } from "flowbite-react";
import { formatDate } from "~/functions/time";

type RemoveFlightModalProps = {
  flight: Flight | null;
  remove: (flightId: string) => void;
  cancel: () => void;
};

export default function RemoveFlightModal({
  flight,
  remove,
  cancel,
}: RemoveFlightModalProps) {
  if (!flight) return null;

  const departure = flight.airports.find(
    (airport) => airport.type === AirportOnFlightType.Departure,
  ) as AirportOnFlight;
  const destination = flight.airports.find(
    (airport) => airport.type === AirportOnFlightType.Destination,
  ) as AirportOnFlight;

  return (
    <Modal show onClose={cancel}>
      <Modal.Header>Remove flight</Modal.Header>
      <Modal.Body>
        <p className="text-gray-900 dark:text-gray-100">
          You are going to remove flight{" "}
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
        <p className="pt-2 text-gray-900 dark:text-gray-100">
          <span className="font-bold">This action is unrecoverable.</span> Are
          you sure to proceed?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <div className="ms-auto flex gap-2">
          <Button color="gray" onClick={cancel}>
            Back
          </Button>
          <Button onClick={() => remove(flight.id)} color="failure">
            Remove flight {flight.flightNumber}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
