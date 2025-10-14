"use client";

import { Flight } from "~/models";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
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
  return (
    <Modal show onClose={cancel}>
      <ModalHeader>Release flight</ModalHeader>
      <ModalBody className="text-gray-900 dark:text-gray-100">
        <p>
          You are going to release flight{" "}
          <span className="font-bold">{flight.flightNumber} </span>
          from{" "}
          <span className="font-bold">
            {flight.departureAirport.city} ({flight.departureAirport.iataCode}
            ){" "}
          </span>
          to{" "}
          <span className="font-bold">
            {flight.destinationAirport.city} (
            {flight.destinationAirport.iataCode})
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
      </ModalBody>
      <ModalFooter>
        <div className="ms-auto flex gap-2">
          <Button color="gray" outline onClick={cancel}>
            Back
          </Button>
          <Button outline color="indigo" onClick={() => release(flight.id)}>
            Release flight
            <span className="font-mono font-bold ms-2">
              {flight.flightNumberWithoutSpaces}
            </span>
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
