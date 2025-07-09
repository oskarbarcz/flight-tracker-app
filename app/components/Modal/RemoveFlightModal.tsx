"use client";

import { AirportOnFlight, AirportOnFlightType, Flight } from "~/models";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { formatDate } from "~/functions/time";

type RemoveFlightModalProps = {
  flight: Flight;
  remove: (flightId: string) => void;
  cancel: () => void;
};

export default function RemoveFlightModal({
  flight,
  remove,
  cancel,
}: RemoveFlightModalProps) {
  const departure = flight.airports.find(
    (airport) => airport.type === AirportOnFlightType.Departure,
  ) as AirportOnFlight;
  const destination = flight.airports.find(
    (airport) => airport.type === AirportOnFlightType.Destination,
  ) as AirportOnFlight;

  return (
    <Modal show onClose={cancel}>
      <ModalHeader>Remove flight</ModalHeader>
      <ModalBody className="text-gray-900 dark:text-gray-100">
        <p>
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
        <p>
          <span className="font-bold">This action is unrecoverable.</span> Are
          you sure to proceed?
        </p>
      </ModalBody>
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button color="gray" onClick={cancel}>
            Back
          </Button>
          <Button onClick={() => remove(flight.id)} color="red">
            Remove flight {flight.flightNumber}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
